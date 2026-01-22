import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { checkAllAlerts } from '@/lib/alert-monitoring';

/**
 * Cron endpoint to check all alerts
 * Protected by ALERT_CRON_SECRET environment variable
 * 
 * Can be triggered by:
 * - Vercel Cron Jobs (every 5 minutes)
 * - External cron services
 * - Manual testing (with secret header)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.ALERT_CRON_SECRET;

    if (!cronSecret) {
      console.warn('[Alert Cron] ALERT_CRON_SECRET not configured');
      return createErrorResponse('Cron secret not configured', 500);
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Run alert monitoring
    console.log('[Alert Cron] Starting alert check...');
    const stats = await checkAllAlerts();
    console.log('[Alert Cron] Alert check complete:', stats);

    return createSuccessResponse({
      message: 'Alert check complete',
      stats
    });
  } catch (error) {
    console.error('[Alert Cron] Error:', error);
    return createErrorResponse('Alert check failed', 500);
  }
}

// Allow POST as well for flexibility
export const POST = GET;
