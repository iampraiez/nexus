import { EmailService } from "@/lib/email-service";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, content, cta } = body;

    // Validate required fields
    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, content" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Send email via EmailService
    const ctaHtml = cta ? `<a href="${cta.url}" class="button">${cta.text}</a>` : undefined;
    const html = EmailService.getBaseTemplate(subject, `<p>${content}</p>`, ctaHtml);

    const result = await EmailService.sendMail({
      to,
      subject,
      text: content,
      html,
      category: "api-request",
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: "Email sent successfully" });
    } else {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 });
    }
  } catch (error) {
    logger.error(`Email API error: ${error}`);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
