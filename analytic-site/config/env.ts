import { z } from "zod";

const isServer = typeof window === "undefined";

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const serverSchema = z.object({
  MONGODB_URI: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_FREE_PRICE_ID: z.string().min(1),
  STRIPE_PRO_PRICE_ID_NGN: z.string().min(1),
  STRIPE_PRO_PRICE_ID: z.string().min(1),
  SENDGRID_API_KEY: z.string().min(1),
  SENDER_EMAIL: z.string().email(),
  GEMINI_API_KEY: z.string().min(1),
  ALERT_CRON_SECRET: z.string().min(1),
});

const publicEnv = publicSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NODE_ENV: process.env.NODE_ENV,
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

if (!publicEnv.success) {
  console.error("Invalid public environment variables:", publicEnv.error.format());
  throw new Error("Invalid public environment variables");
}

let serverEnv = {} as z.infer<typeof serverSchema>;

if (isServer) {
  const parsedServer = serverSchema.safeParse(process.env);
  if (!parsedServer.success) {
    console.error("Invalid server environment variables:", parsedServer.error.format());
    throw new Error("Invalid server environment variables");
  }
  serverEnv = parsedServer.data;
}

export const env = {
  ...publicEnv.data,
  ...serverEnv,
};
