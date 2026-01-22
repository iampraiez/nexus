import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getSessionCompany } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; keyId: string }> }
) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const { projectId, keyId } = await params;
    const db = await getDatabase();

    // Verify project ownership first
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(projectId),
      companyId: company._id,
    });

    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    // Delete API key
    const result = await db.collection('api_keys').deleteOne({
      _id: new ObjectId(keyId),
      projectId: new ObjectId(projectId),
    });

    if (result.deletedCount === 0) {
      return createErrorResponse('API key not found', 404);
    }

    return createSuccessResponse(null, 200, 'API key revoked successfully');
  } catch (error) {
    console.error('Error revoking API key:', error);
    return createErrorResponse('Failed to revoke API key', 500);
  }
}
