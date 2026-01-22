import { EmailService } from './email-service';

export interface NotificationPayload {
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
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .detail { margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #3b82f6; }
            .label { font-weight: bold; color: #6b7280; }
            .value { color: #111827; }
            .footer { margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">⚠️ ${payload.alertName}</h1>
            </div>
            <div class="content">
              <div class="detail">
                <span class="label">Trigger:</span>
                <span class="value">${payload.trigger}</span>
              </div>
              <div class="detail">
                <span class="label">Details:</span>
                <span class="value">${payload.triggerDetails}</span>
              </div>
              ${payload.value !== undefined ? `
                <div class="detail">
                  <span class="label">Current Value:</span>
                  <span class="value">${payload.value}${payload.threshold ? ` (Threshold: ${payload.threshold})` : ''}</span>
                </div>
              ` : ''}
              <div class="detail">
                <span class="label">Triggered At:</span>
                <span class="value">${payload.timestamp.toLocaleString()}</span>
              </div>
            </div>
            <div class="footer">
              This is an automated alert from Nexus Analytics. 
              <a href="https://nexus-anal.vercel.app/dashboard/alerts">Manage your alerts</a>
            </div>
          </div>
        </body>
      </html>
    `;

    await EmailService.sendMail({
      to,
      subject,
      text: payload.triggerDetails,
      html
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
 * Main notification dispatcher
 */
export async function sendNotification(
  type: 'email' | 'webhook',
  target: string,
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  if (type === 'email') {
    return sendEmailNotification(target, payload);
  } else {
    return sendWebhookNotification(target, payload);
  }
}
