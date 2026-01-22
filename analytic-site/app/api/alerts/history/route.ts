import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getSessionCompany } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return createErrorResponse('Invalid pagination parameters', 400);
    }

    const db = await getDatabase();
    
    // Fetch alert history with pagination
    const [history, total] = await Promise.all([
      db.collection('alert_history')
        .find({ companyId: company._id })
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('alert_history')
        .countDocuments({ companyId: company._id })
    ]);

    const responseData = {
      data: history || [],
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + history.length < total,
        totalPages: Math.ceil(total / limit)
      }
    };

    return createSuccessResponse(responseData);
  } catch (error) {
    console.error('Error fetching alert history:', error);
    return createErrorResponse('Failed to fetch alert history', 500);
  }
}
