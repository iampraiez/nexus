import { ObjectId } from 'mongodb';
import { getDatabase } from './db';
import { EmailService } from './email-service';

export interface NotificationPayload {
  companyId?: string | ObjectId;
  alertName: string;
  trigger: string;
  triggerDetails: string;
  value?: number;
  threshold?: number;
  timestamp: Date;
  metadata?: any;
}

/**
 * Send alert notification via email
 */
export async function sendEmailNotification(
  to: string,
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const subject = `🚨 Alert Triggered: ${payload.alertName}`;
    
    const contentHtml = `
      <div style="margin-bottom: 20px;">
        <p style="font-size: 18px; font-weight: 600; color: #ef4444;">🚨 Alert Triggered: ${payload.alertName}</p>
      </div>
      <div style="background-color: #f9fafb; border-left: 4px solid #ef4444; padding: 20px; margin-bottom: 20px;">
        <p style="margin-bottom: 8px;"><span style="color: #6b7280; font-weight: 600;">Trigger:</span> ${payload.trigger}</p>
        <p style="margin-bottom: 8px;"><span style="color: #6b7280; font-weight: 600;">Details:</span> ${payload.triggerDetails}</p>
        ${payload.value !== undefined ? `
          <p style="margin-bottom: 8px;"><span style="color: #6b7280; font-weight: 600;">Current Value:</span> ${payload.value}${payload.threshold ? ` (Threshold: ${payload.threshold})` : ''}</p>
        ` : ''}
        <p style="margin-bottom: 0;"><span style="color: #6b7280; font-weight: 600;">Triggered At:</span> ${payload.timestamp.toLocaleString()}</p>
      </div>
    `;

    const ctaHtml = `<a href="https://nexus-analytics.app/dashboard/alerts" class="button">View Alert Details</a>`;

    const html = EmailService.getBaseTemplate(
      `Alert: ${payload.alertName}`,
      contentHtml,
      ctaHtml
    );

    await EmailService.sendMail({
      to,
      subject,
      text: payload.triggerDetails,
      html,
      category: 'alert'
    });

    return { success: true };
  } catch (error: any) {
    console.error('Email notification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send alert notification via webhook
 */
export async function sendWebhookNotification(
  url: string,
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Nexus-Alerts/1.0'
      },
      body: JSON.stringify({
        event: 'alert.triggered',
        alert: {
          name: payload.alertName,
          trigger: payload.trigger,
          details: payload.triggerDetails,
          value: payload.value,
          threshold: payload.threshold,
          timestamp: payload.timestamp.toISOString(),
          metadata: payload.metadata
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Webhook notification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send alert notification via In-App (Database)
 */
export async function sendInAppNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!payload.companyId) {
      throw new Error('Company ID is required for in-app notifications');
    }
    const db = await getDatabase();
    await db.collection("in_app_notifications").insertOne({
      companyId: new ObjectId(payload.companyId),
      alertName: payload.alertName,
      trigger: payload.trigger,
      triggerDetails: payload.triggerDetails,
      value: payload.value,
      threshold: payload.threshold,
      isRead: false,
      timestamp: new Date(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('In-App notification error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Main notification dispatcher
 */
export async function sendNotification(
  type: 'email' | 'webhook' | 'in-app',
  target: string,
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  if (type === 'email') {
    return sendEmailNotification(target, payload);
  } else if (type === 'webhook') {
    return sendWebhookNotification(target, payload);
  } else {
    return sendInAppNotification(payload);
  }
}
