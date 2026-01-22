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
    
    // Get all projects for the company
    const projects = await db
      .collection('projects')
      .find({ companyId: company._id })
      .toArray();
    
    const projectIds = projects.map(p => p._id);

    // Define funnel steps
    const steps = [
      { name: 'Page Visit', event: 'page_view' },
      { name: 'Product Viewed', event: 'product_viewed' },
      { name: 'Order Created', event: 'order_created' }
    ];

    const funnelData: any[] = [];
    let initialUsers = 0;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Count unique users who performed this event
      const usersCount = await db.collection('events').distinct('userId', {
        projectId: { $in: projectIds },
        eventName: step.event,
        userId: { $ne: null }
      });

      const count = usersCount.length;
      if (i === 0) initialUsers = count;

      const prevCount: number = i === 0 ? count : funnelData[i-1].users;
      const dropoff: number = i === 0 ? 0 : prevCount - count;
      const dropoffPercent: number = i === 0 ? 0 : (prevCount > 0 ? (dropoff / prevCount) * 100 : 0);

      funnelData.push({
        step: i + 1,
        name: step.name,
        users: count,
        dropoff,
        dropoffPercent,
        avgTime: i === 0 ? '-' : '2m 15s' // Mocked avg time
      });
    }

    return createSuccessResponse({
      funnelName: 'Default Conversion Funnel',
      totalUsers: initialUsers,
      overallConversion: initialUsers > 0 ? (funnelData[funnelData.length - 1].users / initialUsers) * 100 : 0,
      steps: funnelData
    });
  } catch (error) {
    console.error('Error fetching funnel analytics:', error);
    return createErrorResponse('Failed to fetch funnel analytics', 500);
  }
}
