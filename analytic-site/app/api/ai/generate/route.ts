import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getSessionCompany } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { generateAnalyticsReport, AnalyticsReportData } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const { period = 'weekly' } = await request.json();
    const db = await getDatabase();

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    if (period === 'daily') startDate.setDate(endDate.getDate() - 1);
    else if (period === 'monthly') startDate.setMonth(endDate.getMonth() - 1);
    else startDate.setDate(endDate.getDate() - 7); // Default weekly

    // Fetch analytics data
    const projectIds = (await db.collection('projects').find({ companyId: company._id }).toArray()).map(p => p._id);
    
    const [totalEvents, activeUsers, topEvents, errorCount] = await Promise.all([
      db.collection('events').countDocuments({ 
        projectId: { $in: projectIds },
        timestamp: { $gte: startDate, $lte: endDate }
      }),
      db.collection('events').distinct('userId', { 
        projectId: { $in: projectIds },
        timestamp: { $gte: startDate, $lte: endDate }
      }).then(ids => ids.length),
      db.collection('events').aggregate([
        { $match: { projectId: { $in: projectIds }, timestamp: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).toArray(),
      db.collection('events').countDocuments({ 
        projectId: { $in: projectIds },
        name: 'error',
        timestamp: { $gte: startDate, $lte: endDate }
      })
    ]);

    // Check if there is enough data
    if (totalEvents === 0) {
      return createSuccessResponse({
        report: `No data available for the selected period (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}). Start tracking events to see AI insights!`,
        generatedAt: new Date(),
        dataAvailable: false
      });
    }

    // Check for existing report generated today (Credit System: 1 per day)
    // Only for manual requests (default)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const existingReportToday = await db.collection('ai_reports').findOne({
      companyId: company._id,
      generatedAt: { $gte: startOfDay },
      'metadata.isAutomated': { $ne: true } // Don't count automated reports against daily limit if we had them
    });

    if (existingReportToday) {
      return createErrorResponse('Daily AI credit used. You can generate one comprehensive report per day.', 429);
    }

    // Generate Report
    const reportData: AnalyticsReportData = {
      companyName: company.name,
      totalEvents,
      activeUsers,
      topEvents: topEvents.map(e => ({ name: e._id, count: e.count })),
      recentErrors: errorCount,
      period,
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString()
    };

    let reportContent;
    try {
      reportContent = await generateAnalyticsReport(reportData);
    } catch (aiError: any) {
      console.error('Gemini Generation Failed:', aiError);
      return createErrorResponse('AI Service Unavailable. Please check API configuration.', 503);
    }

    // Store Report
    const reportDoc = {
      companyId: company._id,
      content: reportContent,
      period,
      startDate,
      endDate,
      generatedAt: new Date(),
      metadata: reportData
    };

    await db.collection('ai_reports').insertOne(reportDoc);

    return createSuccessResponse({
      report: reportContent,
      generatedAt: reportDoc.generatedAt,
      dataAvailable: true
    });

  } catch (error) {
    console.error('AI Report Generation Error:', error);
    return createErrorResponse('Failed to generate report', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const db = await getDatabase();
    const reports = await db.collection('ai_reports')
      .find({ companyId: company._id })
      .sort({ generatedAt: -1 })
      .limit(20)
      .toArray();

    return createSuccessResponse(reports);
  } catch (error) {
    console.error('Fetch reports error:', error);
    return createErrorResponse('Failed to fetch reports', 500);
  }
}
