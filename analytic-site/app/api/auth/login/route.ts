import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { hashPassword, createSessionToken } from '@/lib/crypto';
import { isValidEmail } from '@/lib/validation';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { createSession, setSessionCookie } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !isValidEmail(email)) {
      return createErrorResponse('Invalid email address', 400);
    }

    if (!password) {
      return createErrorResponse('Password required', 400);
    }

    const db = await getDatabase();

    const company = await db.collection('companies').findOne({ email });

    if (!company) {
      return createErrorResponse('Invalid email or password', 401);
    }

    // Check if email is verified
    if (!company.isEmailVerified) {
      return createSuccessResponse(
        {
          companyId: company._id,
          requiresVerification: true,
        },
        200,
        'Email not verified. Please verify your email.'
      );
    }

    // Verify password
    const passwordHash = hashPassword(password);
    if (passwordHash !== company.passwordHash) {
      return createErrorResponse('Invalid email or password', 401);
    }

    // Create session token
    const token = await createSession(new ObjectId(company._id));
    await setSessionCookie(token);

    logger.info(`Login successful for ${email}`);

    return createSuccessResponse(
      {
        companyId: company._id,
        email: company.email,
        name: company.name,
        plan: company.plan,
      },
      200,
      'Login successful'
    );
  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('Login failed', 500);
  }
}
