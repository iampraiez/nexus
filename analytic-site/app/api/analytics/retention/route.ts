import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getSessionCompany } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';

import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse('Not authenticated', 401);
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const projectId = searchParams.get('projectId');
    const environment = searchParams.get('environment');

    const db = await getDatabase();
    
    // Get all projects for the company to verify ownership
    const projects = await db
      .collection('projects')
      .find({ companyId: company._id })
      .toArray();
    
    const allProjectIds = projects.map(p => p._id);
    let filterProjectIds = allProjectIds;

    if (projectId && projectId !== 'all') {
      const selectedProjectId = new ObjectId(projectId);
      if (allProjectIds.some(id => id.equals(selectedProjectId))) {
        filterProjectIds = [selectedProjectId];
      } else {
        return createErrorResponse('Project not found or access denied', 404);
      }
    }

    const matchStage: any = {
      projectId: { $in: filterProjectIds }
    };

    if (environment && environment !== 'all') {
      matchStage.environment = environment;
    }

    // Calculate weekly cohorts
    const cohorts = [];
    const now = new Date();
    
    // We'll always show 4 weeks of cohorts for retention analysis
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7);

      // Users who first appeared in this week
      const cohortUsers = await db.collection('tracked_users').find({
        ...matchStage,
        firstSeen: { $gte: weekStart, $lt: weekEnd }
      }).toArray();

      const userIds = cohortUsers.map(u => u.externalUserId);
      const totalUsers = userIds.length;

      if (totalUsers === 0) {
        cohorts.push({
          cohort: `Week of ${weekStart.toLocaleDateString()}`,
          users: 0,
          day1: 0,
          day7: 0,
          day14: 0,
          day30: 0
        });
        continue;
      }

      // Check activity in subsequent periods
      const checkRetention = async (days: number) => {
        const activityStart = new Date(weekStart.getTime() + days * 24 * 60 * 60 * 1000);
        if (activityStart > now) return null;

        const activeCount = await db.collection('events').distinct('userId', {
          ...matchStage,
          userId: { $in: userIds },
          timestamp: { $gte: activityStart }
        });
        return activeCount.length;
      };

      cohorts.push({
        cohort: `Week of ${weekStart.toLocaleDateString()}`,
        users: totalUsers,
        day1: totalUsers,
        day7: await checkRetention(7),
        day14: await checkRetention(14),
        day30: await checkRetention(30)
      });
    }

    // Calculate key metrics from cohort data
    let totalUsers = 0;
    let day1Total = 0;
    let day7Total = 0;
    let day30Total = 0;
    let day7Count = 0;
    let day30Count = 0;

    cohorts.forEach(cohort => {
      if (cohort.users > 0) {
        totalUsers += cohort.users;
        day1Total += cohort.day1 || 0;
        
        if (cohort.day7 !== null) {
          day7Total += cohort.day7;
          day7Count++;
        }
        
        if (cohort.day30 !== null) {
          day30Total += cohort.day30;
          day30Count++;
        }
      }
    });

    const day1Retention = totalUsers > 0 ? ((day1Total / totalUsers) * 100).toFixed(1) : '0.0';
    const day7Retention = day7Count > 0 ? ((day7Total / totalUsers) * 100).toFixed(1) : '0.0';
    const day30Retention = day30Count > 0 ? ((day30Total / totalUsers) * 100).toFixed(1) : '0.0';

    return createSuccessResponse({
      cohorts,
      keyMetrics: [
        { label: 'Day 1 Retention', value: `${day1Retention}%`, description: 'Users active on signup day' },
        { label: 'Day 7 Retention', value: `${day7Retention}%`, description: 'Coming back within 7 days' },
        { label: 'Day 30 Retention', value: `${day30Retention}%`, description: 'Active after 30 days' }
      ]
    });
  } catch (error) {
    console.error('Error fetching retention analytics:', error);
    return createErrorResponse('Failed to fetch retention analytics', 500);
  }
}
