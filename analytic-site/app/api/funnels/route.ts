import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";
import { getSessionCompany } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return createErrorResponse("Project ID required", 400);
    }

    const db = await getDatabase();
    
    // Verify ownership
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(projectId),
      companyId: company._id
    });

    if (!project) {
       return createErrorResponse("Project not found", 404);
    }

    const funnels = await db.collection("funnels").find({ projectId: new ObjectId(projectId) }).toArray();

    return createSuccessResponse(funnels);
  } catch (error) {
    console.error("Error fetching funnels:", error);
    return createErrorResponse("Failed to fetch funnels", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    const body = await request.json();
    const { name, projectId, steps } = body;

    if (!name || !projectId || !steps || !Array.isArray(steps) || steps.length < 2) {
      return createErrorResponse("Missing required fields or invalid steps (min 2 steps required)", 400);
    }

    const db = await getDatabase();
    
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(projectId),
      companyId: company._id
    });

    if (!project) {
       return createErrorResponse("Project not found", 404);
    }

    const result = await db.collection("funnels").insertOne({
      companyId: company._id,
      projectId: new ObjectId(projectId),
      name,
      steps,
      createdAt: new Date(),
    });

    return createSuccessResponse({ _id: result.insertedId, ...body });
  } catch (error) {
    console.error("Error creating funnel:", error);
    return createErrorResponse("Failed to create funnel", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return createErrorResponse("Funnel ID required", 400);
    }

    const db = await getDatabase();

    const result = await db.collection("funnels").deleteOne({ 
      _id: new ObjectId(id),
      companyId: company._id
    });

    if (result.deletedCount === 0) {
       return createErrorResponse("Funnel not found or access denied", 404);
    }

    return createSuccessResponse({ deleted: true });
  } catch (error) {
    console.error("Error deleting funnel:", error);
    return createErrorResponse("Failed to delete funnel", 500);
  }
}
