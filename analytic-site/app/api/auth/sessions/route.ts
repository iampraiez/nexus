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
    const sessions = await db.collection('sessions')
      .find({ companyId: company._id, expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .toArray();

    // Mask tokens for security, only show last 4 chars or just ID
    const safeSessions = sessions.map(s => ({
      _id: s._id,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: false, // Logic to determine current session would require token comparison which we can do if we read the cookie here, but for now let's just list them.
      // Ideally we'd store UA/IP in session to make this useful
    }));

    return createSuccessResponse(safeSessions);
  } catch (error) {
    console.error('Fetch sessions error:', error);
    return createErrorResponse('Failed to fetch sessions', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');

    if (!sessionId) {
      return createErrorResponse('Session ID required', 400);
    }

    const db = await getDatabase();
    await db.collection('sessions').deleteOne({ 
      _id: new ObjectId(sessionId),
      companyId: company._id 
    });

    return createSuccessResponse({ message: 'Session revoked' });
  } catch (error) {
    console.error('Revoke session error:', error);
    return createErrorResponse('Failed to revoke session', 500);
  }
}
