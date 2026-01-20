import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('analytics-session')?.value;

    if (token) {
      const db = await getDatabase();
      await db.collection('sessions').deleteOne({ token });
    }

    // Clear cookie
    cookieStore.delete('analytics-session');

    console.log('[v0] Logout successful');

    return createSuccessResponse({ success: true }, 200, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    return createErrorResponse('Logout failed', 500);
  }
}
