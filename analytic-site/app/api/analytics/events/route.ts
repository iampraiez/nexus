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

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const projectId = searchParams.get('projectId');
    const environment = searchParams.get('environment');

    const db = await getDatabase();
    
    // Get all projects for the company to verify ownership
    const projects = await db
      .collection('projects')
      .find({ companyId: company._id })
      .toArray();
    
    const allProjectIds = projects.map(p => p._id);
    let filterProjectIds = allProjectIds;

    if (projectId && projectId !== 'all') {
      const selectedProjectId = new ObjectId(projectId);
      if (allProjectIds.some(id => id.equals(selectedProjectId))) {
        filterProjectIds = [selectedProjectId];
      } else {
        return createErrorResponse('Project not found or access denied', 404);
      }
    }

    const matchStage: any = {
      projectId: { $in: filterProjectIds }
    };

    if (environment && environment !== 'all') {
      matchStage.environment = environment;
    }

    const now = new Date();
    let startDate = new Date();
    let days = 7;

    if (range === '24h') {
      startDate.setHours(now.getHours() - 24);
      days = 1;
    } else if (range === '30d') {
      startDate.setDate(now.getDate() - 30);
      days = 30;
    } else if (range === 'all') {
      startDate = new Date(0); // Beginning of time
      days = 365; // Default for avg calculation if all
    } else {
      startDate.setDate(now.getDate() - 7);
      days = 7;
    }

    if (range !== 'all') {
      matchStage.timestamp = { $gte: startDate };
    }

    // 1. Total Events in range
    const totalEvents = await db.collection('events').countDocuments(matchStage);

    // 2. Events Over Time
    const eventsOverTime = await db.collection('events').aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: range === '24h' ? "%Y-%m-%d %H:00" : "%Y-%m-%d", 
              date: "$timestamp" 
            }
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
      { $match: matchStage },
      {
        $group: {
          _id: "$eventName",
          value: { $sum: 1 }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 10 }
    ]).toArray();

    // 4. Events by Environment
    const eventsByEnvironment = await db.collection('events').aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$environment",
          events: { $sum: 1 }
        }
      }
    ]).toArray();

    // 5. Unique Event Types
    const uniqueEventTypes = await db.collection('events').distinct('eventName', matchStage);

    // 6. Errors
    const errorEvents = await db.collection('events').countDocuments({
      ...matchStage,
      eventName: { $regex: /error/i }
    });

    return createSuccessResponse({
      metrics: {
        totalEvents,
        avgEventsPerDay: Math.round(totalEvents / days),
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
