import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, code } = body;

    if (!companyId || !code) {
      return createErrorResponse('Company ID and verification code required', 400);
    }

    const db = await getDatabase();

    const company = await db.collection('companies').findOne({
      _id: new ObjectId(companyId),
    });

    if (!company) {
      return createErrorResponse('Company not found', 404);
    }

    if (company.isEmailVerified) {
      return createErrorResponse('Email already verified', 400);
    }

    // Check if code has expired
    if (!company.emailVerificationCodeExpiresAt || company.emailVerificationCodeExpiresAt < new Date()) {
      return createErrorResponse('Verification code has expired', 400);
    }

    // Hash the provided code and compare
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    if (codeHash !== company.emailVerificationCode) {
      return createErrorResponse('Invalid verification code', 400);
    }

    // Mark email as verified
    await db.collection('companies').updateOne(
      { _id: new ObjectId(companyId) },
      {
        $set: {
          isEmailVerified: true,
          updatedAt: new Date(),
        },
        $unset: {
          emailVerificationCode: '',
          emailVerificationCodeExpiresAt: '',
        },
      }
    );

    console.log('[v0] Email verified for company:', companyId);

    return createSuccessResponse({ companyId }, 200, 'Email verified successfully');
  } catch (error) {
    console.error('Email verification error:', error);
    return createErrorResponse('Email verification failed', 500);
  }
}
