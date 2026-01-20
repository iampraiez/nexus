import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import stripe from '@/lib/stripe';
import { ObjectId } from 'mongodb';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

async function handleCheckoutSessionCompleted(event: any) {
  const session = event.data.object;
  const companyId = session.metadata?.companyId;

  if (!companyId) return;

  const db = await getDatabase();

  // Create Stripe customer if needed
  let customerId = session.customer;
  if (!customerId && session.customer_email) {
    const customer = await stripe.customers.create({
      email: session.customer_email,
    });
    customerId = customer.id;
  }

  // Update company with Stripe customer ID
  await db.collection('companies').updateOne(
    { _id: new ObjectId(companyId) },
    {
      $set: {
        stripeCustomerId: customerId,
        updatedAt: new Date(),
      },
    }
  );

  // Create subscription record
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription
  );

  await db.collection('subscriptions').insertOne({
    companyId: new ObjectId(companyId),
    stripeSubscriptionId: session.subscription,
    stripePriceId: session.metadata?.plan || 'pro',
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    createdAt: new Date(),
  });

  // Update company plan
  await db.collection('companies').updateOne(
    { _id: new ObjectId(companyId) },
    {
      $set: {
        plan: 'pro',
        updatedAt: new Date(),
      },
    }
  );

  console.log('[v0] Subscription created for company:', companyId);
}

async function handleInvoicePaid(event: any) {
  const invoice = event.data.object;

  if (invoice.subscription) {
    const db = await getDatabase();

    // Update subscription status
    await db.collection('subscriptions').updateOne(
      { stripeSubscriptionId: invoice.subscription },
      {
        $set: {
          status: 'active',
          updatedAt: new Date(),
        },
      }
    );

    console.log('[v0] Invoice paid for subscription:', invoice.subscription);
  }
}

async function handleInvoicePaymentFailed(event: any) {
  const invoice = event.data.object;

  if (invoice.subscription) {
    const db = await getDatabase();

    // Update subscription status
    await db.collection('subscriptions').updateOne(
      { stripeSubscriptionId: invoice.subscription },
      {
        $set: {
          status: 'past_due',
          updatedAt: new Date(),
        },
      }
    );

    console.log('[v0] Invoice payment failed for subscription:', invoice.subscription);
  }
}

async function handleSubscriptionDeleted(event: any) {
  const subscription = event.data.object;

  const db = await getDatabase();

  // Update subscription in database
  await db.collection('subscriptions').updateOne(
    { stripeSubscriptionId: subscription.id },
    {
      $set: {
        status: 'canceled',
        canceledAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  console.log('[v0] Subscription canceled:', subscription.id);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return new Response('Webhook Error: No signature', { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(`Webhook Error: ${err}`, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;
      default:
        console.log('[v0] Unhandled webhook event:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 500 });
  }
}
