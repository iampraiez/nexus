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

    if (range === '24h') {
      startDate.setHours(now.getHours() - 24);
    } else if (range === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else if (range === 'all') {
      startDate = new Date(0);
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    if (range !== 'all') {
      matchStage.timestamp = { $gte: startDate };
    }

    // 1. Health Data Over Time
    const healthData = await db.collection('events').aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: range === '24h' ? "%Y-%m-%d %H:00" : "%Y-%m-%d", 
              date: "$timestamp" 
            }
          },
          total: { $sum: 1 },
          errors: {
            $sum: { $cond: [{ $regexMatch: { input: "$eventName", regex: /error/i } }, 1, 0] }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]).toArray();


    // 2. Error Types
    const errorTypes = await db.collection('events').aggregate([
      {
        $match: {
          ...matchStage,
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

    // Calculate real metrics from event data
    const totalEvents = await db.collection('events').countDocuments(matchStage);
    const errorRate = totalEvents > 0 ? (totalErrors / totalEvents) * 100 : 0;
    const deliveryRate = 100 - errorRate; // Approximation: assumes non-error events are delivered successfully

    // Calculate real latency metrics from event latency field
    const latencyStats = await db.collection('events').aggregate([
      { $match: { ...matchStage, latency: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: null,
          avgLatency: { $avg: "$latency" },
          latencies: { $push: "$latency" }
        }
      }
    ]).toArray();

    let avgLatency = 0;
    let p95Latency = 0;
    
    if (latencyStats.length > 0 && latencyStats[0].latencies) {
      const latencies = latencyStats[0].latencies.sort((a: number, b: number) => a - b);
      avgLatency = Math.round(latencyStats[0].avgLatency || 0);
      
      // Calculate p95
      const p95Index = Math.ceil(latencies.length * 0.95) - 1;
      p95Latency = latencies[p95Index] || 0;
    }

    // Calculate real SDK version distribution
    const versionStatsAgg = await db.collection('events').aggregate([
      { $match: { ...matchStage, sdkVersion: { $exists: true, $ne: 'unknown' } } },
      {
        $group: {
          _id: "$sdkVersion",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    const totalVersionedEvents = versionStatsAgg.reduce((acc, curr) => acc + curr.count, 0);
    const versionStats = versionStatsAgg.map(v => ({
      version: v._id,
      count: v.count,
      percentage: totalVersionedEvents > 0 ? parseFloat(((v.count / totalVersionedEvents) * 100).toFixed(1)) : 0
    }));

    return createSuccessResponse({
      metrics: {
        deliveryRate: parseFloat(deliveryRate.toFixed(1)),
        errorRate: parseFloat(errorRate.toFixed(2)),
        avgLatency,
        p95Latency
      },
      healthData: healthData.map(d => ({
        date: d._id,
        deliveryRate: d.total > 0 ? parseFloat(((d.total - d.errors) / d.total * 100).toFixed(1)) : 100,
        errorRate: d.total > 0 ? parseFloat(((d.errors / d.total) * 100).toFixed(2)) : 0,
        latency: avgLatency // Use overall average per time period
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
