import { Db, ObjectId } from 'mongodb';
import { AlertCheckResult } from './high-error-rate';

/**
 * Check for potential API key abuse patterns
 */
export async function checkApiKeyAbuse(
  companyId: ObjectId,
  projectId: ObjectId | null,
  db: Db
): Promise<AlertCheckResult> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  // Get API keys for this company's projects
  const projects = await db.collection('projects').find({ companyId }).toArray();
  const projectIds = projectId ? [projectId] : projects.map(p => p._id);

  const apiKeys = await db.collection('api_keys').find({
    projectId: { $in: projectIds }
  }).toArray();

  if (apiKeys.length === 0) {
    return {
      triggered: false,
      triggerDetails: 'No API keys to monitor',
      value: 0,
      threshold: 1000
    };
  }

  // Check for extremely high request rate (>1000 events in 5 minutes)
  const recentEvents = await db.collection('events').countDocuments({
    projectId: { $in: projectIds },
    timestamp: { $gte: fiveMinutesAgo }
  });

  const eventsPerMinute = recentEvents / 5;

  // Check for requests from too many unique IPs in the last hour
  // This would require storing IP addresses with events
  // For now, we'll focus on request rate

  const triggered = eventsPerMinute > 200; // 1000 events per 5 min = 200/min threshold

  const abusivePatterns: string[] = [];
  
  if (eventsPerMinute > 200) {
    abusivePatterns.push(`Extremely high request rate: ${Math.round(eventsPerMinute)} events/min`);
  }

  return {
    triggered,
    triggerDetails: triggered
      ? `Potential abuse detected: ${abusivePatterns.join(', ')}`
      : 'No abuse patterns detected',
    value: Math.round(eventsPerMinute),
    threshold: 200,
    metadata: {
      eventsInLast5Min: recentEvents,
      eventsPerMinute: Math.round(eventsPerMinute),
      patterns: abusivePatterns
    }
  };
}
