import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getSessionCompany } from '@/lib/auth';
import { generateApiKey, hashApiKey, maskApiKey } from '@/lib/crypto';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { ObjectId } from 'mongodb';

export async function GET(
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

    // Verify project ownership
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(projectId),
      companyId: company._id,
    });

    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    const apiKeys = await db
      .collection('api_keys')
      .find({ projectId: new ObjectId(projectId) })
      .toArray();

    return createSuccessResponse(apiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return createErrorResponse('Failed to fetch API keys', 500);
  }
}

export async function POST(
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

    // Verify project ownership
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(projectId),
      companyId: company._id,
    });

    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    // Generate API key
    const key = generateApiKey();
    const hashedKey = hashApiKey(key);
    const displayKey = maskApiKey(key);

    const apiKey = {
      projectId: new ObjectId(projectId),
      key: hashedKey,
      displayKey,
      isActive: true,
      createdAt: new Date(),
    };

    const result = await db.collection('api_keys').insertOne(apiKey);

    console.log('[v0] API key generated:', result.insertedId);

    return createSuccessResponse(
      {
        ...apiKey,
        _id: result.insertedId,
        key, // Return actual key only once
      },
      201,
      'API key generated successfully'
    );
  } catch (error) {
    console.error('Error generating API key:', error);
    return createErrorResponse('Failed to generate API key', 500);
  }
}
