import { NextRequest } from 'next/server';
import { EmailService } from '@/lib/email-service';
import { getDatabase } from '@/lib/db';
import { hashPassword, generateVerificationCode } from '@/lib/crypto';
import { isValidEmail, isValidPassword, isValidCompanyName } from '@/lib/validation';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { Company } from '@/lib/types';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, companyName } = body;

    // Validate inputs
    if (!email || !isValidEmail(email)) {
      return createErrorResponse('Invalid email address', 400);
    }

    if (!password || !isValidPassword(password)) {
      return createErrorResponse(
        'Password must be at least 8 characters with uppercase, lowercase, and numbers',
        400
      );
    }

    if (!companyName || !isValidCompanyName(companyName)) {
      return createErrorResponse('Invalid company name', 400);
    }

    const db = await getDatabase();

    // Check if email already exists
    const existingCompany = await db.collection('companies').findOne({ email });
    if (existingCompany) {
      return createErrorResponse('Email already registered', 409);
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeHash = require('crypto')
      .createHash('sha256')
      .update(verificationCode)
      .digest('hex');

    // Create company
    const company = {
      name: companyName,
      email,
      passwordHash: hashPassword(password),
      isEmailVerified: false,
      emailVerificationCode: verificationCodeHash,
      emailVerificationCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      plan: 'free' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('companies').insertOne(company);

    logger.info(`Registration successful for ${email}. Code for testing: ${verificationCode}`);

    // Send verification email
    try {
      await EmailService.sendVerificationCode(email, verificationCode);
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}: ${error}`);
      // We don't fail the registration, but we should log it
    }

    return createSuccessResponse(
      {
        companyId: result.insertedId,
        email,
        requiresVerification: true,
      },
      201,
      'Registration successful. Please verify your email.'
    );
  } catch (error) {
    console.error('Registration error:', error);
    return createErrorResponse('Registration failed', 500);
  }
}
