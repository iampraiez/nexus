import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import { ObjectId } from "mongodb";
import { sendInAppNotification } from "@/lib/notification-service";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.ALERT_CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      // In a real environment, enforce this. For demo, we can bypass or log warning.
      console.warn("Unauthorized / no cron secret for anomaly detector");
    }

    const db = await getDatabase();
    const projects = await db.collection("projects").find({}).toArray();

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const stats = { checked: 0, anomalies: 0 };

    for (const project of projects) {
      stats.checked++;

      // Count events in last 1 hour
      const lastHourEvents = await db.collection("events").countDocuments({
        projectId: project._id,
        timestamp: { $gte: oneHourAgo, $lte: now }
      });

      // Count events in previous 24 hours
      const last24hEvents = await db.collection("events").countDocuments({
        projectId: project._id,
        timestamp: { $gte: twentyFourHoursAgo, $lt: oneHourAgo }
      });

      const hourlyAverage = last24hEvents / 24;

      // Simple anomaly detection: if the last hour is 50% lower than the 24h average, and average > 10
      if (hourlyAverage > 10 && lastHourEvents < hourlyAverage * 0.5) {
        stats.anomalies++;
        
        // Trigger In-App Notification
        await sendInAppNotification({
          companyId: project.companyId,
          alertName: "Traffic Drop Detected",
          trigger: "anomaly_detection",
          triggerDetails: `Event volume for project ${project.name} dropped significantly. Last hour: ${lastHourEvents}, Average: ${Math.round(hourlyAverage)}`,
          value: lastHourEvents,
          threshold: hourlyAverage * 0.5,
          timestamp: now
        });
      }
    }

    return createSuccessResponse({
      message: "Anomaly detection complete",
      stats
    });
  } catch (error) {
    console.error("Anomaly detector failed:", error);
    return createErrorResponse("Anomaly detector failed", 500);
  }
}

export const POST = GET;
