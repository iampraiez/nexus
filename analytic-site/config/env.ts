import { z } from "zod";

const isServer = typeof window === "undefined";
// Relax validation during build to prevent CI failures when secrets are missing
const isBuild = process.env.NODE_ENV === "production";

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .preprocess((val) => (val === "" ? undefined : val), z.string().url().optional())
    .default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const serverSchema = z.object({
  MONGODB_URI: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_FREE_PRICE_ID: z.string().optional(),
  STRIPE_PRO_PRICE_ID_NGN: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().min(1),
  SENDGRID_API_KEY: z.string().min(1),
  SENDER_EMAIL: z.string().email(),
  GEMINI_API_KEY: z.string().min(1),
  ALERT_CRON_SECRET: z.string().min(1),
});

const getEnv = () => {
  const publicEnvResult = publicSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!publicEnvResult.success) {
    console.error("Invalid public environment variables:", publicEnvResult.error.format());
    if (isBuild) {
      return {
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        NODE_ENV: "production" as const,
      };
    }
    throw new Error("Invalid public environment variables");
  }

  let serverEnv = {} as any;

  if (isServer) {
    const parsedServer = serverSchema.safeParse(process.env);
    if (!parsedServer.success) {
      if (isBuild) {
        console.warn("Using dummy server environment variables for build process");
        return {
          ...publicEnvResult.data,
          MONGODB_URI: process.env.MONGODB_URI || "mongodb://dummy",
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_dummy",
          STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "whsec_dummy",
          STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID || "price_dummy",
          SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "dummy",
          SENDER_EMAIL: process.env.SENDER_EMAIL || "dummy@example.com",
          GEMINI_API_KEY: process.env.GEMINI_API_KEY || "dummy",
          ALERT_CRON_SECRET: process.env.ALERT_CRON_SECRET || "dummy",
        };
      }
      console.error("Invalid server environment variables:", parsedServer.error.format());
      throw new Error("Invalid server environment variables");
    }
    serverEnv = parsedServer.data;
  }

  return {
    ...publicEnvResult.data,
    ...serverEnv,
  };
};

export const env = getEnv();
