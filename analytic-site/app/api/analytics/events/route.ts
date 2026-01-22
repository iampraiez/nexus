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

    // 2. Events Over Time (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const eventsOverTime = await db.collection('events').aggregate([
      {
        $match: {
          projectId: { $in: projectIds },
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 },
          pageViews: {
            $sum: { $cond: [{ $eq: ["$eventName", "page_view"] }, 1, 0] }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]).toArray();

    // 3. Top Events
    const topEvents = await db.collection('events').aggregate([
      {
        $match: { projectId: { $in: projectIds } }
      },
      {
        $group: {
          _id: "$eventName",
          value: { $sum: 1 }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 5 }
    ]).toArray();

    // 4. Events by Environment
    const eventsByEnvironment = await db.collection('events').aggregate([
      {
        $match: { projectId: { $in: projectIds } }
      },
      {
        $group: {
          _id: "$environment",
          events: { $sum: 1 }
        }
      }
    ]).toArray();

    // 5. Unique Event Types
    const uniqueEventTypes = await db.collection('events').distinct('eventName', {
      projectId: { $in: projectIds }
    });

    // 6. Errors (Mocked for now as we don't have a specific error field, but we can look for 'error' in eventName)
    const errorEvents = await db.collection('events').countDocuments({
      projectId: { $in: projectIds },
      eventName: { $regex: /error/i }
    });

    return createSuccessResponse({
      metrics: {
        totalEvents,
        avgEventsPerDay: Math.round(totalEvents / 7),
        uniqueEventTypes: uniqueEventTypes.length,
        errorCount: errorEvents,
        errorRate: totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0
      },
      eventsOverTime: eventsOverTime.map(d => ({
        date: d._id,
        events: d.count,
        pageViews: d.pageViews
      })),
      topEvents: topEvents.map(e => ({
        name: e._id,
        value: e.value
      })),
      eventsByEnvironment: eventsByEnvironment.map(e => ({
        name: e._id || 'unknown',
        events: e.events
      }))
    });
  } catch (error) {
    console.error('Error fetching events analytics:', error);
    return createErrorResponse('Failed to fetch events analytics', 500);
  }
}
