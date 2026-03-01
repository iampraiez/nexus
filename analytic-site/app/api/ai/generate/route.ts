import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";
import { getSessionCompany } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import { generateAnalyticsReport, AnalyticsReportData } from "@/lib/ai-service";

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    const { period = "weekly" } = await request.json();
    const db = await getDatabase();

    // Check for existing report generated today (Credit System: 1 per day)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingReportToday = await db.collection("ai_reports").findOne({
      companyId: company._id,
      generatedAt: { $gte: startOfDay },
      "metadata.isAutomated": { $ne: true },
    });

    if (existingReportToday) {
      return createErrorResponse(
        "Daily AI credit limit reached. You can generate one comprehensive report per day.",
        429
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    if (period === "daily") startDate.setDate(endDate.getDate() - 1);
    else if (period === "monthly") startDate.setMonth(endDate.getMonth() - 1);
    else startDate.setDate(endDate.getDate() - 7); // Default weekly

    // Fetch analytics data
    const projectIds = (
      await db.collection("projects").find({ companyId: company._id }).toArray()
    ).map((p) => p._id);

    const [totalEvents, activeUsers, topEvents, errorCount] = await Promise.all([
      db.collection("events").countDocuments({
        projectId: { $in: projectIds },
        timestamp: { $gte: startDate, $lte: endDate },
      }),
      db
        .collection("events")
        .distinct("userId", {
          projectId: { $in: projectIds },
          timestamp: { $gte: startDate, $lte: endDate },
        })
        .then((ids) => ids.length),
      db
        .collection("events")
        .aggregate([
          {
            $match: {
              projectId: { $in: projectIds },
              timestamp: { $gte: startDate, $lte: endDate },
            },
          },
          { $group: { _id: "$eventName", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ])
        .toArray(),
      db.collection("events").countDocuments({
        projectId: { $in: projectIds },
        name: "error",
        timestamp: { $gte: startDate, $lte: endDate },
      }),
    ]);

    // Check if there is enough data
    if (totalEvents === 0) {
      return createSuccessResponse({
        report: `No data available for the selected period (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}). Start tracking events to see AI insights!`,
        generatedAt: new Date(),
        dataAvailable: false,
      });
    }

    // Prepare report data
    const reportData: AnalyticsReportData = {
      companyName: company.name,
      totalEvents,
      activeUsers,
      topEvents: topEvents.map((e) => ({ name: e._id, count: e.count })),
      recentErrors: errorCount,
      period,
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
    };

    // Create pending report immediately
    const reportDoc = {
      companyId: company._id,
      content: "",
      period,
      startDate,
      endDate,
      status: "pending",
      generatedAt: new Date(),
      metadata: reportData,
    };

    const result = await db.collection("ai_reports").insertOne(reportDoc);
    const reportId = result.insertedId;

    // Start background generation (don't await)
    generateInBackground(reportId.toString(), reportData, company._id).catch((err) => {
      console.error("Background generation failed:", err);
    });

    // Return immediately with pending status
    return createSuccessResponse({
      reportId: reportId.toString(),
      status: "pending",
      generatedAt: reportDoc.generatedAt,
      dataAvailable: true,
      period,
    });
  } catch (error) {
    console.error("AI Report Generation Error:", error);
    return createErrorResponse("an error occurred", 500);
  }
}

// Background generation function
async function generateInBackground(
  reportId: string,
  reportData: AnalyticsReportData,
  companyId: any
) {
  const db = await getDatabase();
  const { ObjectId } = await import("mongodb");
  try {
    const reportContent = await generateAnalyticsReport(reportData);

    // Update report with completed content
    await db.collection("ai_reports").updateOne(
      { _id: new ObjectId(reportId) },
      {
        $set: {
          content: reportContent,
          status: "completed",
          completedAt: new Date(),
        },
      }
    );
  } catch (aiError: any) {
    console.error("Background generation failed:", aiError);
    // Mark as failed
    await db.collection("ai_reports").updateOne(
      { _id: new ObjectId(reportId) },
      {
        $set: {
          status: "failed",
          error: aiError.message || "Generation failed",
          failedAt: new Date(),
        },
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    const db = await getDatabase();
    const reports = await db
      .collection("ai_reports")
      .find({ companyId: company._id })
      .sort({ generatedAt: -1 })
      .limit(20)
      .toArray();

    return createSuccessResponse(reports);
  } catch (error) {
    console.error("Fetch reports error:", error);
    return createErrorResponse("Failed to fetch reports", 500);
  }
}
