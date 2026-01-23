import { NextRequest, NextResponse } from 'next/server';
import { getSessionCompany } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';

export async function PATCH(request: NextRequest) {
  try {
    const company = await getSessionCompany(request);
    if (!company) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { name, preferences } = body;

    const { db } = await connectToDatabase();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (preferences) updateData.preferences = preferences;

    if (Object.keys(updateData).length === 0) {
      return createErrorResponse('No data to update', 400);
    }

    await db.collection('companies').updateOne(
      { _id: new ObjectId(company._id) },
      { $set: updateData }
    );

    return createSuccessResponse({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    return createErrorResponse('Failed to update settings', 500);
  }
}
