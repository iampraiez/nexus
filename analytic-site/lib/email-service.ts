import sgMail from "@sendgrid/mail";
import { logger } from "./logger";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@nexus-analytics.app";

if (!SENDGRID_API_KEY) {
  logger.warn("SendGrid API key not found in environment variables");
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface MessageProps {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailService {
  static async sendMail(
    data: MessageProps,
  ): Promise<{ success: boolean; error?: string }> {
    // if (process.env.NODE_ENV === 'development') {
    //   logger.info('--- MOCK EMAIL SENDING (Development Mode) ---');
    //   logger.info(`To: ${data.to}`);
    //   logger.info(`Subject: ${data.subject}`);
    //   logger.info('--------------------------');
    //   return { success: true };
    // }

    if (!SENDGRID_API_KEY) {
      logger.error("Cannot send email: SendGrid not configured");
      return { success: false, error: "Email service not configured" };
    }

    try {
      await sgMail.send({
        to: data.to,
        from: SENDER_EMAIL,
        subject: data.subject,
        text: data.text,
        html: data.html || data.text,
      });
      logger.info(`Email sent to ${data.to}`);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(`Error sending email: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  static async sendVerificationCode(
    email: string,
    code: string,
  ): Promise<void> {
    const subject = "Verify your email address";
    const text = `Thank you for signing up! Please verify your email address by entering the following code: ${code}\n\nThis code will expire in 5 minutes.\n\nIf you did not request this, please ignore this email.`;

    // Using a template similar to the one in lib/sendgrid.tsx but adapted to the user's style
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #1f2937; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #5fb3f5 0%, #8dd3fc 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            .code-box { background-color: #ffffff; border: 1px solid #e5e7eb; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px; color: #5fb3f5; }
            h1 { margin: 0; font-size: 28px; }
            p { margin: 0 0 16px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Nexus</h1>
            </div>
            <div class="content">
              <p>Thank you for signing up! Please verify your email address by entering the following code:</p>
              <div class="code-box">
                ${code}
              </div>
              <p>This code will expire in 5 minutes.</p>
              <p>If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2026 Nexus. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendMail({ to: email, subject, text, html });
  }
}
