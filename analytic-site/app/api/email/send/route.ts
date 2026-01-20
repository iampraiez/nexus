import { EmailService } from '@/lib/email-service';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, content, cta } = body;

    // Validate required fields
    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, content' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email via EmailService
    const result = await EmailService.sendMail({
      to,
      subject,
      text: content,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #1f2937; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #5fb3f5 0%, #8dd3fc 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
              .button { display: inline-block; background: #5fb3f5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              h1 { margin: 0; font-size: 28px; }
              p { margin: 0 0 16px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${subject}</h1>
              </div>
              <div class="content">
                <p>${content}</p>
                ${cta ? `<a href="${cta.url}" class="button">${cta.text}</a>` : ''}
              </div>
              <div class="footer">
                <p>© 2026 Nexus. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error(`Email API error: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
