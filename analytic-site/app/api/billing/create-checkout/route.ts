import { NextRequest } from 'next/server';
import { getSessionCompany } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import stripe, { PLANS } from '@/lib/stripe';
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !['free', 'pro'].includes(plan)) {
      return createErrorResponse('Invalid plan', 400);
    }

    const planConfig = PLANS[plan as keyof typeof PLANS];

    // If upgrading to free, just return success (no payment needed)
    if (plan === 'free') {
      const db = await getDatabase();
      await db.collection('companies').updateOne(
        { _id: company._id },
        {
          $set: {
            plan: 'free',
            updatedAt: new Date(),
          },
        }
      );

      return createSuccessResponse(
        { plan: 'free', status: 'success' },
        200,
        'Downgraded to Free plan'
      );
    }

    // For pro plan, create checkout session
    if (!planConfig.priceId) {
      console.error('Stripe Price ID is missing for plan:', plan);
      return createErrorResponse('Billing configuration error. Please contact support.', 500);
    }

    const session = await stripe.checkout.sessions.create({
      customer: company.stripeCustomerId || undefined,
      customer_email: company.stripeCustomerId ? undefined : company.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing`,
      metadata: {
        companyId: company._id?.toString(),
        plan,
      },
    });

    return createSuccessResponse(
      { sessionId: session.id, url: session.url },
      200,
      'Checkout session created'
    );
  } catch (error) {
    console.error('Billing error:', error);
    return createErrorResponse('Failed to create checkout session', 500);
  }
}
