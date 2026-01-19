import { getDB } from "@/lib/db";

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  limit: number,
  windowSeconds: number
) {
  const db = await getDB();
  const collection = db.collection("rate_limits");

  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  const key = `${ip}:${endpoint}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

  const result = await collection.findOneAndUpdate(
    { _id: key } as any,
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt },
    },
    { upsert: true, returnDocument: "after" }
  );

  const currentCount = result?.count || result?.value?.count || 1;

  if (currentCount > limit) {
    throw new Error("Rate limit exceeded");
  }
}
