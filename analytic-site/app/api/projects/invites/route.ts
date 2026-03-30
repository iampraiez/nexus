import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";
import { getSessionCompany } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import { ObjectId } from "mongodb";
import { EmailService } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    const body = await request.json();
    const { projectId, email, role = "viewer" } = body;

    if (!projectId || !email) {
      return createErrorResponse("Missing projectId or email", 400);
    }

    const db = await getDatabase();
    
    // Verify user has admin rights to this project
    const project = await db.collection("projects").findOne({ 
      _id: new ObjectId(projectId), 
      companyId: company._id 
    });

    if (!project) {
       return createErrorResponse("Project not found or you don't have access", 404);
    }

    // Add to members array or invites array
    await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) },
      { 
        $addToSet: { 
          invites: { 
            email, 
            role, 
            invitedAt: new Date(), 
            invitedBy: company._id 
          } 
        } 
      }
    );

    // Send email
    // A real implementation would generate a secure token here
    const inviteLink = `https://nexus-analytics.app/invite?project=${projectId}`;
    
    await EmailService.sendMail({
      to: email,
      subject: `You have been invited to join ${project.name} on Nexus Analytics`,
      text: `You have been invited to join the project ${project.name} with role ${role}. Join here: ${inviteLink}`,
      html: `<p>You have been invited to join the project <strong>${project.name}</strong> with role <strong>${role}</strong>.</p><a href="${inviteLink}">Accept Invitation</a>`,
      category: 'invite'
    });

    return createSuccessResponse({ invited: email, role });
  } catch (error) {
    console.error("Error sending invite:", error);
    return createErrorResponse("Failed to send invite", 500);
  }
}
