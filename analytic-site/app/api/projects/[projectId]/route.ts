import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getSessionCompany } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { ObjectId } from 'mongodb';
import { isValidProjectName } from '@/lib/validation';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const { projectId } = await params;
    const body = await request.json();
    const { name, environment } = body;

    const updateData: any = { updatedAt: new Date() };
    if (name) {
      if (!isValidProjectName(name)) {
        return createErrorResponse('Invalid project name', 400);
      }
      updateData.name = name;
    }
    if (environment) {
      if (!['production', 'staging', 'development'].includes(environment)) {
        return createErrorResponse('Invalid environment', 400);
      }
      updateData.environment = environment;
    }

    const db = await getDatabase();
    const result = await db.collection('projects').findOneAndUpdate(
      { _id: new ObjectId(projectId), companyId: company._id },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return createErrorResponse('Project not found', 404);
    }

    return createSuccessResponse(result, 200, 'Project updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
    return createErrorResponse('Failed to update project', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const { projectId } = await params;
    const db = await getDatabase();

    // Delete project
    const projectResult = await db.collection('projects').deleteOne({
      _id: new ObjectId(projectId),
      companyId: company._id,
    });

    if (projectResult.deletedCount === 0) {
      return createErrorResponse('Project not found', 404);
    }

    // Delete associated API keys
    await db.collection('api_keys').deleteMany({
      projectId: new ObjectId(projectId),
    });

    return createSuccessResponse(null, 200, 'Project and associated API keys deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    return createErrorResponse('Failed to delete project', 500);
  }
}
