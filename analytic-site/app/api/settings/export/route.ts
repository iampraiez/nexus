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

    const db = await getDatabase();

    // Fetch all data related to the company
    const [projects, events, users, funnels] = await Promise.all([
      db.collection('projects').find({ companyId: company._id }).toArray(),
      db.collection('events').find({ projectId: { $in: (await db.collection('projects').find({ companyId: company._id }).toArray()).map(p => p._id) } }).limit(10000).toArray(), // Limit for safety
      db.collection('users').find({ projectId: { $in: (await db.collection('projects').find({ companyId: company._id }).toArray()).map(p => p._id) } }).toArray(),
      db.collection('funnels').find({ projectId: { $in: (await db.collection('projects').find({ companyId: company._id }).toArray()).map(p => p._id) } }).toArray(),
    ]);

    const exportData = {
      company: {
        name: company.name,
        email: company.email,
        createdAt: company.createdAt,
      },
      projects,
      funnels,
      users,
      recentEvents: events,
      exportDate: new Date().toISOString(),
    };

    return createSuccessResponse(exportData);
  } catch (error) {
    console.error('Export error:', error);
    return createErrorResponse('Failed to export data', 500);
  }
}
