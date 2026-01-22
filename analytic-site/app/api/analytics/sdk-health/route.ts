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

    // 1. Health Data Over Time (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const healthData = await db.collection('events').aggregate([
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
          total: { $sum: 1 },
          errors: {
            $sum: { $cond: [{ $regexMatch: { input: "$eventName", regex: /error/i } }, 1, 0] }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]).toArray();

    // 2. SDK Versions (Mocked for now as we don't track version in events yet)
    const versionStats = [
      { version: '1.1.4', count: 4200, percentage: 85 },
      { version: '1.1.0', count: 500, percentage: 10 },
      { version: '1.0.0', count: 250, percentage: 5 },
    ];

    // 3. Error Types
    const errorTypes = await db.collection('events').aggregate([
      {
        $match: {
          projectId: { $in: projectIds },
          eventName: { $regex: /error/i }
        }
      },
      {
        $group: {
          _id: "$eventName",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    const totalErrors = errorTypes.reduce((acc, curr) => acc + curr.count, 0);

    return createSuccessResponse({
      metrics: {
        deliveryRate: 99.9, // Mocked
        errorRate: 0.1, // Mocked
        avgLatency: 142, // Mocked
        p95Latency: 256 // Mocked
      },
      healthData: healthData.map(d => ({
        date: d._id,
        deliveryRate: 99.9,
        errorRate: (d.errors / d.total) * 100,
        latency: 140 + Math.random() * 20
      })),
      versionStats,
      errorTypes: errorTypes.map(e => ({
        type: e._id,
        count: e.count,
        percentage: totalErrors > 0 ? (e.count / totalErrors) * 100 : 0
      }))
    });
  } catch (error) {
    console.error('Error fetching SDK health analytics:', error);
    return createErrorResponse('Failed to fetch SDK health analytics', 500);
  }
}
