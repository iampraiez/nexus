import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;

// Plan configurations
export const PLANS = {
  free: {
    name: "Free",
    priceId: process.env.STRIPE_FREE_PRICE_ID || "",
    priceIdNgn: "",
    amount: 0,
    amountNgn: 0,
    eventsPerMonth: 10000,
    features: ["Basic analytics", "Limited retention"],
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    priceIdNgn: process.env.STRIPE_PRO_PRICE_ID_NGN || "",
    amount: 9900,
    amountNgn: 1400000,
    eventsPerMonth: 1000000,
    features: [
      "Unlimited events",
      "Advanced analytics",
      "Full retention",
      "Email alerts",
      "Priority support",
      "Custom integrations",
    ],
  },
};

export async function createCustomer(
  email: string,
  companyName: string,
): Promise<string> {
  const customer = await stripe.customers.create({
    email,
    name: companyName,
    metadata: {
      companyName,
    },
  });

  return customer.id;
}

export async function createSubscription(
  customerId: string,
  priceId: string,
  plan: "free" | "pro",
): Promise<{ subscriptionId: string; clientSecret?: string }> {
  if (plan === "free") {
    // Free plan doesn't require payment intent
    return { subscriptionId: "" };
  }

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  });

  const invoice = subscription.latest_invoice as any;
  const paymentIntent = invoice?.payment_intent as Stripe.PaymentIntent;

  return {
    subscriptionId: subscription.id,
    clientSecret: paymentIntent?.client_secret || undefined,
  };
}

export async function getSubscription(
  subscriptionId: string,
): Promise<Stripe.Subscription | null> {
  if (!subscriptionId) return null;

  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    return null;
  }
}

export async function cancelSubscription(
  subscriptionId: string,
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string,
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
    proration_behavior: "create_prorations",
  });
}

export async function listInvoices(
  customerId: string,
): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit: 100,
  });

  return invoices.data;
}

export async function getCustomer(
  customerId: string,
): Promise<Stripe.Customer> {
  return stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>;
}

export async function updateCustomerPaymentMethod(
  customerId: string,
  paymentMethodId: string,
): Promise<Stripe.Customer> {
  return stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  }) as Promise<Stripe.Customer>;
}
