import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { hashApiKey } from '@/lib/crypto';
import { isValidEventName, isValidUserId } from '@/lib/validation';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { ObjectId } from 'mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Signature, X-Timestamp',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid API key' },
        { status: 401, headers: corsHeaders }
      );
    }

    const apiKey = authHeader.substring(7);
    const hashedKey = hashApiKey(apiKey);

    const db = await getDatabase();

    // Find API key and project
    const keyDoc = await db.collection('api_keys').findOne({ key: hashedKey });
    if (!keyDoc) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Update last used
    await db.collection('api_keys').updateOne(
      { _id: keyDoc._id },
      { $set: { lastUsedAt: new Date() } }
    );

    const body = await request.json();
    const { events, batch } = body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No events provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Process events
    const processedEvents = events.map((event: any) => {
      if (!event.eventName || !isValidEventName(event.eventName)) {
        throw new Error('Invalid event name');
      }

      if (event.userId && !isValidUserId(event.userId)) {
        throw new Error('Invalid user ID');
      }

      return {
        projectId: keyDoc.projectId,
        userId: event.userId || null,
        eventName: event.eventName,
        properties: event.properties || {},
        timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
        environment: event.environment || 'production',
        sdkVersion: event.sdkVersion || 'unknown',
        latency: typeof event.latency === 'number' ? event.latency : null,
        userAgent: event.userAgent,
        country: event.country,
      };
    });

    // Insert events
    if (processedEvents.length > 0) {
      const result = await db.collection('events').insertMany(processedEvents);
      console.log("[v0] Events ingested:", (result.insertedIds as any).length);

      // Track user if userId provided
      for (const event of processedEvents) {
        if (event.userId) {
          await db.collection('tracked_users').updateOne(
            {
              projectId: event.projectId,
              externalUserId: event.userId,
            },
            {
              $set: {
                lastSeen: new Date(),
                projectId: event.projectId,
                externalUserId: event.userId,
              },
              $setOnInsert: {
                firstSeen: new Date(),
                traits: {},
              },
            },
            { upsert: true }
          );
        }
      }

      // Update usage meter
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      await db.collection('usage_meters').updateOne(
        {
          projectId: keyDoc.projectId,
          month: monthStart,
        },
        {
          $inc: {
            eventCount: processedEvents.length,
          },
          $setOnInsert: {
            activeUsers: 0,
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          received: processedEvents.length,
          batchId: batch?.id,
        },
        message: 'Events accepted for processing'
      },
      { status: 202, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Event ingestion error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Event ingestion failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
