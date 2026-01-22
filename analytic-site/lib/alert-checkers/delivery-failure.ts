import { Db, ObjectId } from 'mongodb';
import { AlertCheckResult } from './high-error-rate';

/**
 * Check for delivery failures in the last 15 minutes
 */
export async function checkDeliveryFailure(
  companyId: ObjectId,
  projectId: ObjectId | null,
  db: Db
): Promise<AlertCheckResult> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const matchStage: any = {
    timestamp: { $gte: fifteenMinutesAgo }
  };

  if (projectId) {
    matchStage.projectId = projectId;
  } else {
    const projects = await db.collection('projects').find({ companyId }).toArray();
    matchStage.projectId = { $in: projects.map(p => p._id) };
  }

  // Check for events that indicate delivery issues
  // This could be expanded based on your actual data structure
  const failedDeliveries = await db.collection('events').countDocuments({
    ...matchStage,
    $or: [
      { eventName: { $regex: /delivery.*fail/i } },
      { eventName: { $regex: /fail.*deliver/i } },
      { 'properties.deliveryStatus': 'failed' }
    ]
  });

  const triggered = failedDeliveries > 0;

  return {
    triggered,
    triggerDetails: triggered
      ? `${failedDeliveries} delivery failure(s) detected in the last 15 minutes`
      : 'No delivery failures detected',
    value: failedDeliveries,
    threshold: 0,
    metadata: {
      timeWindow: '15 minutes',
      failureCount: failedDeliveries
    }
  };
}
