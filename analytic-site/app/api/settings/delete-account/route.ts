import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getSessionCompany, clearSessionCookie } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';

export async function DELETE(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const db = await getDatabase();

    // 1. Get all project IDs
    const projects = await db.collection('projects').find({ companyId: company._id }).toArray();
    const projectIds = projects.map(p => p._id);

    // 2. Delete all related data
    await Promise.all([
      db.collection('events').deleteMany({ projectId: { $in: projectIds } }),
      db.collection('users').deleteMany({ projectId: { $in: projectIds } }),
      db.collection('funnels').deleteMany({ projectId: { $in: projectIds } }),
      db.collection('api_keys').deleteMany({ projectId: { $in: projectIds } }),
      db.collection('projects').deleteMany({ companyId: company._id }),
      db.collection('sessions').deleteMany({ companyId: company._id }),
      db.collection('alert_history').deleteMany({ companyId: company._id }),
      db.collection('companies').deleteOne({ _id: company._id }),
    ]);

    // 3. Clear session cookie
    await clearSessionCookie();

    return createSuccessResponse({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return createErrorResponse('Failed to delete account', 500);
  }
}
