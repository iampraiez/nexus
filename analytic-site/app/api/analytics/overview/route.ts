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

    // 1. Total Events
    const totalEvents = await db.collection('events').countDocuments({
      projectId: { $in: projectIds }
    });

    // 2. Active Users (Unique users across all projects)
    const activeUsers = await db.collection('tracked_users').countDocuments({
      projectId: { $in: projectIds }
    });

    // 3. Conversion Rate (Orders / Total Sessions or Page Views)
    // For now, let's calculate it as (order_created events / product_viewed events)
    // If no events, default to 0
    const orderCreatedCount = await db.collection('events').countDocuments({
      projectId: { $in: projectIds },
      eventName: 'order_created'
    });

    const productViewedCount = await db.collection('events').countDocuments({
      projectId: { $in: projectIds },
      eventName: 'product_viewed'
    });

    const conversionRate = productViewedCount > 0 
      ? (orderCreatedCount / productViewedCount) * 100 
      : 0;

    // 4. Project Count
    const projectCount = projects.length;

    // Calculate changes (mocked for now as we don't have historical data easily accessible without more complex aggregation)
    // In a real app, we'd compare with the previous period.
    
    return createSuccessResponse({
      stats: [
        {
          label: "Total Events",
          value: totalEvents.toLocaleString(),
          change: "+0%", // Needs historical comparison
          positive: true,
        },
        {
          label: "Active Users",
          value: activeUsers.toLocaleString(),
          change: "+0%",
          positive: true,
        },
        {
          label: "Conversion Rate",
          value: `${conversionRate.toFixed(2)}%`,
          change: "0%",
          positive: true,
        },
        {
          label: "Projects",
          value: projectCount.toString(),
          change: "All active",
          positive: true,
        },
      ]
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return createErrorResponse('Failed to fetch analytics overview', 500);
  }
}
