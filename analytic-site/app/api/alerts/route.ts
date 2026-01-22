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

export async function DELETE(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      return createErrorResponse('Alert ID required', 400);
    }

    const db = await getDatabase();
    
    // Verify ownership before deleting
    const alert = await db.collection('alerts').findOne({ 
      _id: new ObjectId(alertId),
      companyId: company._id 
    });

    if (!alert) {
      return createErrorResponse('Alert not found or access denied', 404);
    }

    await db.collection('alerts').deleteOne({ _id: new ObjectId(alertId) });

    return createSuccessResponse({ deleted: true });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return createErrorResponse('Failed to delete alert', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const body = await request.json();
    const { id, name, type, target, triggers, enabled } = body;

    if (!id) {
      return createErrorResponse('Alert ID required', 400);
    }

    const db = await getDatabase();
    
    // Verify ownership before updating
    const alert = await db.collection('alerts').findOne({ 
      _id: new ObjectId(id),
      companyId: company._id 
    });

    if (!alert) {
      return createErrorResponse('Alert not found or access denied', 404);
    }

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (type !== undefined) updateFields.type = type;
    if (target !== undefined) updateFields.target = target;
    if (triggers !== undefined) updateFields.triggers = triggers;
    if (enabled !== undefined) updateFields.enabled = enabled;

    await db.collection('alerts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return createSuccessResponse({ updated: true, ...updateFields });
  } catch (error) {
    console.error('Error updating alert:', error);
    return createErrorResponse('Failed to update alert', 500);
  }
}
