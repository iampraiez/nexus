import { Db, ObjectId } from 'mongodb';
import { AlertCheckResult } from './high-error-rate';

/**
 * Check if usage is approaching 90% of quota
 */
export async function checkUsageLimit(
  companyId: ObjectId,
  projectId: ObjectId | null,
  db: Db
): Promise<AlertCheckResult> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get company to check quota
  const company = await db.collection('companies').findOne({ _id: companyId });
  
  if (!company || !company.eventQuota) {
    return {
      triggered: false,
      triggerDetails: 'No quota configured',
      value: 0,
      threshold: 90
    };
  }

  const quota = company.eventQuota;

  // Get usage for current month
  const matchStage: any = {
    month: monthStart
  };

  if (projectId) {
    matchStage.projectId = projectId;
  } else {
    const projects = await db.collection('projects').find({ companyId }).toArray();
    matchStage.projectId = { $in: projects.map(p => p._id) };
  }

  const usageMeters = await db.collection('usage_meters').find(matchStage).toArray();
  const totalUsage = usageMeters.reduce((sum, meter) => sum + (meter.eventCount || 0), 0);

  const usagePercentage = (totalUsage / quota) * 100;
  const triggered = usagePercentage >= 90;

  return {
    triggered,
    triggerDetails: triggered
      ? `Usage at ${usagePercentage.toFixed(1)}% (${totalUsage.toLocaleString()}/${quota.toLocaleString()} events)`
      : `Usage at ${usagePercentage.toFixed(1)}% of quota`,
    value: parseFloat(usagePercentage.toFixed(1)),
    threshold: 90,
    metadata: {
      totalUsage,
      quota,
      month: monthStart.toISOString()
    }
  };
}
