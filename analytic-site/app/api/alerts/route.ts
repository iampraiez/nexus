import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getSessionCompany } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const db = await getDatabase();
    const alerts = await db.collection('alerts').find({ companyId: company._id }).toArray();

    return createSuccessResponse(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return createErrorResponse('Failed to fetch alerts', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const body = await request.json();
    const { name, type, target, triggers } = body;

    if (!name || !type || !target || !triggers) {
      return createErrorResponse('Missing required fields', 400);
    }

    const db = await getDatabase();
    const result = await db.collection('alerts').insertOne({
      companyId: company._id,
      name,
      type,
      target,
      triggers,
      enabled: true,
      createdAt: new Date()
    });

    return createSuccessResponse({ _id: result.insertedId, ...body });
  } catch (error) {
    console.error('Error creating alert:', error);
    return createErrorResponse('Failed to create alert', 500);
  }
}
