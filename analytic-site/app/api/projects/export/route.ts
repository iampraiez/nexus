import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";
import { getSessionCompany } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return new Response("Not authenticated", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const environment = searchParams.get("environment") || "production";
    const limit = parseInt(searchParams.get("limit") || "10000", 10);

    if (!projectId) {
      return new Response("Project ID required", { status: 400 });
    }

    const db = await getDatabase();
    
    // Verify ownership
    const project = await db.collection("projects").findOne({ 
      _id: new ObjectId(projectId), 
      companyId: company._id 
    });

    if (!project) {
       return new Response("Project not found or you don't have access", { status: 404 });
    }

    const events = await db.collection("events")
      .find({ projectId: new ObjectId(projectId), environment })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    // Convert to CSV
    const headers = ["Event ID", "Event Name", "User ID", "Session ID", "Environment", "Timestamp", "Properties JSON", "Metadata JSON"];
    const rows = events.map(e => [
      e._id.toString(),
      e.eventName,
      e.userId || "anonymous",
      e.sessionId,
      e.environment || environment,
      e.timestamp ? new Date(e.timestamp).toISOString() : "",
      JSON.stringify(e.properties || {}).replace(/"/g, '""'),
      JSON.stringify(e.metadata || {}).replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${project.name.replace(/\\s+/g, '_')}_events_export.csv"`
      }
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return new Response("Failed to export data", { status: 500 });
  }
}
