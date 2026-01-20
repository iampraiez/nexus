import { NextRequest } from 'next/server';
import { getSessionCompany } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import stripe from '@/lib/stripe';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const db = await getDatabase();

    // Get subscription from database
    const subscription = await db.collection('subscriptions').findOne({
      companyId: company._id,
    });

    if (!subscription) {
      return createSuccessResponse({
        plan: company.plan,
        status: 'no_subscription',
      });
    }

    // Get Stripe subscription details
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    return createSuccessResponse({
      plan: company.plan,
      status: stripeSubscription.status,
      currentPeriodStart: new Date(
        stripeSubscription.current_period_start * 1000
      ),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      canceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000)
        : null,
      items: stripeSubscription.items.data.map((item) => ({
        id: item.id,
        priceId: item.price.id,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return createErrorResponse('Failed to fetch subscription', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const body = await request.json();
    const { action } = body;

    const db = await getDatabase();
    const subscription = await db.collection('subscriptions').findOne({
      companyId: company._id,
    });

    if (!subscription) {
      return createErrorResponse('No active subscription', 404);
    }

    if (action === 'cancel') {
      // Cancel subscription
      const stripeSubscription = await stripe.subscriptions.del(
        subscription.stripeSubscriptionId
      );

      // Update database
      await db.collection('subscriptions').updateOne(
        { companyId: company._id },
        {
          $set: {
            status: 'canceled',
            canceledAt: new Date(),
          },
        }
      );

      // Downgrade company to free
      await db.collection('companies').updateOne(
        { _id: company._id },
        {
          $set: {
            plan: 'free',
            updatedAt: new Date(),
          },
        }
      );

      return createSuccessResponse({ status: 'canceled' }, 200, 'Subscription canceled');
    }

    if (action === 'resume') {
      // Resume canceled subscription
      const stripeSubscription = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        { pause_collection: null }
      );

      await db.collection('subscriptions').updateOne(
        { companyId: company._id },
        {
          $set: {
            status: stripeSubscription.status,
            canceledAt: null,
          },
        }
      );

      return createSuccessResponse({ status: stripeSubscription.status }, 200, 'Subscription resumed');
    }

    return createErrorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return createErrorResponse('Failed to update subscription', 500);
  }
}
