import { Db, ObjectId } from 'mongodb';

export interface AlertCheckResult {
  triggered: boolean;
  triggerDetails: string;
  value?: number;
  threshold?: number;
  metadata?: any;
}

/**
 * Check if error rate exceeds 5% in the last hour
 */
export async function checkHighErrorRate(
  companyId: ObjectId,
  projectId: ObjectId | null,
  db: Db
): Promise<AlertCheckResult> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const matchStage: any = {
    timestamp: { $gte: oneHourAgo }
  };

  // If projectId is specified, filter by it
  if (projectId) {
    matchStage.projectId = projectId;
  } else {
    // Get all projects for this company
    const projects = await db.collection('projects').find({ companyId }).toArray();
    matchStage.projectId = { $in: projects.map(p => p._id) };
  }

  // Count total events
  const totalEvents = await db.collection('events').countDocuments(matchStage);

  if (totalEvents === 0) {
    return {
      triggered: false,
      triggerDetails: 'No events in the last hour',
      value: 0,
      threshold: 5
    };
  }

  // Count error events (events with error-related names)
  const errorEvents = await db.collection('events').countDocuments({
    ...matchStage,
    eventName: { $regex: /error/i }
  });

  const errorRate = (errorEvents / totalEvents) * 100;
  const triggered = errorRate > 5;

  return {
    triggered,
    triggerDetails: triggered
      ? `Error rate at ${errorRate.toFixed(2)}% (${errorEvents}/${totalEvents} events)`
      : `Error rate normal at ${errorRate.toFixed(2)}%`,
    value: parseFloat(errorRate.toFixed(2)),
    threshold: 5,
    metadata: {
      totalEvents,
      errorEvents,
      timeWindow: '1 hour'
    }
  };
}
