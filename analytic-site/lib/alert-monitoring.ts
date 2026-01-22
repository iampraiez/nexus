import { Db, ObjectId } from 'mongodb';
import { getDatabase } from './db';
import { checkHighErrorRate } from './alert-checkers/high-error-rate';
import { checkDeliveryFailure } from './alert-checkers/delivery-failure';
import { checkUsageLimit } from './alert-checkers/usage-limit';
import { checkApiKeyAbuse } from './alert-checkers/api-key-abuse';
import { checkLatencySpike } from './alert-checkers/latency-spike';
import { sendNotification, NotificationPayload } from './notification-service';

/**
 * Check if an alert was recently triggered (within cooldown period)
 */
async function wasRecentlyTriggered(
  alertId: ObjectId,
  trigger: string,
  db: Db
): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const recentTrigger = await db.collection('alert_history').findOne({
    alertId,
    trigger,
    sentAt: { $gte: oneHourAgo },
    status: 'sent'
  });

  return recentTrigger !== null;
}

/**
 * Check a specific trigger condition
 */
async function checkTrigger(
  trigger: string,
  companyId: ObjectId,
  projectId: ObjectId | null,
  db: Db
) {
  switch (trigger) {
    case 'high_error_rate':
      return checkHighErrorRate(companyId, projectId, db);
    case 'delivery_failure':
      return checkDeliveryFailure(companyId, projectId, db);
    case 'usage_limit':
      return checkUsageLimit(companyId, projectId, db);
    case 'api_key_abuse':
      return checkApiKeyAbuse(companyId, projectId, db);
    case 'latency_spike':
      return checkLatencySpike(companyId, projectId, db);
    default:
      return {
        triggered: false,
        triggerDetails: `Unknown trigger: ${trigger}`,
        value: 0
      };
  }
}

/**
 * Create alert history entry
 */
async function createHistoryEntry(
  alert: any,
  trigger: string,
  result: any,
  notificationResult: { success: boolean; error?: string },
  db: Db
) {
  await db.collection('alert_history').insertOne({
    alertId: alert._id,
    companyId: alert.companyId,
    projectId: alert.projectId || null,
    alertName: alert.name,
    trigger,
    triggerDetails: result.triggerDetails,
    value: result.value,
    threshold: result.threshold,
    status: notificationResult.success ? 'sent' : 'failed',
    failureReason: notificationResult.error,
    sentAt: new Date(),
    metadata: result.metadata
  });
}

/**
 * Update alert last triggered timestamp
 */
async function updateLastTriggered(alertId: ObjectId, db: Db) {
  await db.collection('alerts').updateOne(
    { _id: alertId },
    {
      $set: { lastTriggered: new Date() },
      $inc: { triggerCount: 1 }
    }
  );
}

/**
 * Main alert monitoring function
 * Called by cron job to check all enabled alerts
 */
export async function checkAllAlerts(): Promise<{
  checked: number;
  triggered: number;
  sent: number;
  failed: number;
}> {
  const db = await getDatabase();
  
  const stats = {
    checked: 0,
    triggered: 0,
    sent: 0,
    failed: 0
  };

  try {
    // Get all enabled alerts
    const alerts = await db.collection('alerts').find({ enabled: true }).toArray();
    
    console.log(`[Alert Monitor] Checking ${alerts.length} enabled alerts`);

    for (const alert of alerts) {
      stats.checked++;

      try {
        // Check each trigger condition for this alert
        for (const trigger of alert.triggers) {
          // Check if recently triggered (debouncing)
          const recentlyTriggered = await wasRecentlyTriggered(alert._id, trigger, db);
          if (recentlyTriggered) {
            console.log(`[Alert Monitor] Skipping ${alert.name} - ${trigger} (recently triggered)`);
            continue;
          }

          // Check the trigger condition
          const result = await checkTrigger(
            trigger,
            alert.companyId,
            alert.projectId || null,
            db
          );

          if (result.triggered) {
            stats.triggered++;
            console.log(`[Alert Monitor] Alert triggered: ${alert.name} - ${trigger}`);

            // Prepare notification payload
            const payload: NotificationPayload = {
              alertName: alert.name,
              trigger,
              triggerDetails: result.triggerDetails,
              value: result.value,
              threshold: result.threshold,
              timestamp: new Date(),
              metadata: result.metadata
            };

            // Send notification
            const notificationResult = await sendNotification(
              alert.type,
              alert.target,
              payload
            );

            if (notificationResult.success) {
              stats.sent++;
              console.log(`[Alert Monitor] Notification sent to ${alert.target}`);
            } else {
              stats.failed++;
              console.error(`[Alert Monitor] Notification failed: ${notificationResult.error}`);
            }

            // Create history entry
            await createHistoryEntry(alert, trigger, result, notificationResult, db);

            // Update last triggered
            await updateLastTriggered(alert._id, db);
          }
        }
      } catch (error) {
        console.error(`[Alert Monitor] Error processing alert ${alert.name}:`, error);
      }
    }

    console.log(`[Alert Monitor] Complete. Stats:`, stats);
    return stats;
  } catch (error) {
    console.error('[Alert Monitor] Fatal error:', error);
    throw error;
  }
}
