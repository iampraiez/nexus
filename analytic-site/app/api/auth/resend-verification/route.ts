import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { generateVerificationCode } from '@/lib/crypto';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { EmailService } from '@/lib/email-service';
import { logger } from '@/lib/logger';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId } = body;

    if (!companyId) {
      return createErrorResponse('Company ID required', 400);
    }

    const db = await getDatabase();
    const company = await db.collection('companies').findOne({ 
      _id: new ObjectId(companyId) 
    });

    if (!company) {
      return createErrorResponse('Company not found', 404);
    }

    if (company.isEmailVerified) {
      return createErrorResponse('Email already verified', 400);
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeHash = crypto
      .createHash('sha256')
      .update(verificationCode)
      .digest('hex');

    // Update company with new code
    await db.collection('companies').updateOne(
      { _id: company._id },
      {
        $set: {
          emailVerificationCode: verificationCodeHash,
          emailVerificationCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
          updatedAt: new Date(),
        },
      }
    );

    logger.info(`Resend verification code: ${verificationCode} to ${company.email}`);

    // Send email
    try {
      await EmailService.sendVerificationCode(company.email, verificationCode);
    } catch (error) {
      logger.error(`Failed to send verification email to ${company.email}: ${error}`);
      return createErrorResponse('Failed to send email', 500);
    }

    return createSuccessResponse(
      { sent: true },
      200,
      'Verification email sent'
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
