import { NextRequest } from 'next/server';
import { getSessionCompany } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();

    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    return createSuccessResponse({
      companyId: company._id,
      email: company.email,
      name: company.name,
      plan: company.plan,
      isEmailVerified: company.isEmailVerified,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return createErrorResponse('Session check failed', 500);
  }
}
