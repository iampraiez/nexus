import { Db, ObjectId } from 'mongodb';
import { AlertCheckResult } from './high-error-rate';

/**
 * Check if average latency exceeds 500ms in the last hour
 */
export async function checkLatencySpike(
  companyId: ObjectId,
  projectId: ObjectId | null,
  db: Db
): Promise<AlertCheckResult> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const matchStage: any = {
    timestamp: { $gte: oneHourAgo },
    latency: { $exists: true, $ne: null }
  };

  if (projectId) {
    matchStage.projectId = projectId;
  } else {
    const projects = await db.collection('projects').find({ companyId }).toArray();
    matchStage.projectId = { $in: projects.map(p => p._id) };
  }

  const latencyStats = await db.collection('events').aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        avgLatency: { $avg: "$latency" },
        count: { $sum: 1 }
      }
    }
  ]).toArray();

  if (latencyStats.length === 0) {
    return {
      triggered: false,
      triggerDetails: 'No latency data in the last hour',
      value: 0,
      threshold: 500
    };
  }

  const avgLatency = Math.round(latencyStats[0].avgLatency);
  const threshold = 500; // 500ms threshold
  const triggered = avgLatency > threshold;

  return {
    triggered,
    triggerDetails: triggered
      ? `Average latency spike detected: ${avgLatency}ms (Threshold: ${threshold}ms)`
      : `Average latency normal at ${avgLatency}ms`,
    value: avgLatency,
    threshold,
    metadata: {
      avgLatency,
      eventCount: latencyStats[0].count,
      timeWindow: '1 hour'
    }
  };
}
