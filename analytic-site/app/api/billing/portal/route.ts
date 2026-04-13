import { NextRequest } from "next/server";
import { getSessionCompany } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    if (!company.stripeCustomerId) {
      return createErrorResponse("No payment information found", 404);
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing`;

    const session = await stripe.billingPortal.sessions.create({
      customer: company.stripeCustomerId,
      return_url: returnUrl,
    });

    return createSuccessResponse({ url: session.url }, 200, "Portal session created");
  } catch (error) {
    console.error("Portal session error:", error);
    return createErrorResponse("Failed to create portal session", 500);
  }
}
