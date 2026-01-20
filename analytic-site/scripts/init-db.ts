import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'analytics-saas';

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Create collections
    const collections = [
      'companies',
      'projects',
      'api_keys',
      'events',
      'tracked_users',
      'sdk_errors',
      'usage_meters',
      'alerts',
      'audit_logs',
      'subscriptions',
      'sessions',
    ];

    for (const collection of collections) {
      const exists = await db.listCollections({ name: collection }).hasNext();
      if (!exists) {
        await db.createCollection(collection);
        console.log(`✓ Created collection: ${collection}`);
      } else {
        console.log(`✓ Collection already exists: ${collection}`);
      }
    }

    // Create indexes for companies
    await db.collection('companies').createIndex({ email: 1 }, { unique: true });
    console.log('✓ Created index on companies.email');

    // Create indexes for projects
    await db.collection('projects').createIndex({ companyId: 1 });
    console.log('✓ Created index on projects.companyId');

    // Create indexes for api_keys
    await db.collection('api_keys').createIndex({ projectId: 1 });
    await db.collection('api_keys').createIndex({ key: 1 }, { unique: true });
    console.log('✓ Created indexes on api_keys');

    // Create indexes for events
    await db.collection('events').createIndex({ projectId: 1 });
    await db.collection('events').createIndex({ timestamp: 1 });
    await db.collection('events').createIndex({ 'projectId': 1, 'timestamp': -1 });
    await db.collection('events').createIndex(
      { projectId: 1, timestamp: 1 },
      { expireAfterSeconds: 7776000 } // 90 days
    );
    console.log('✓ Created indexes on events');

    // Create indexes for tracked_users
    await db.collection('tracked_users').createIndex({ projectId: 1 });
    await db.collection('tracked_users').createIndex({ 'projectId': 1, 'externalUserId': 1 }, { unique: true });
    console.log('✓ Created indexes on tracked_users');

    // Create indexes for sdk_errors
    await db.collection('sdk_errors').createIndex({ projectId: 1 });
    await db.collection('sdk_errors').createIndex({ timestamp: 1 });
    console.log('✓ Created indexes on sdk_errors');

    // Create indexes for usage_meters
    await db.collection('usage_meters').createIndex({ projectId: 1 });
    await db.collection('usage_meters').createIndex({ 'projectId': 1, 'month': 1 }, { unique: true });
    console.log('✓ Created indexes on usage_meters');

    // Create indexes for alerts
    await db.collection('alerts').createIndex({ projectId: 1 });
    console.log('✓ Created indexes on alerts');

    // Create indexes for audit_logs
    await db.collection('audit_logs').createIndex({ companyId: 1 });
    await db.collection('audit_logs').createIndex({ createdAt: 1 });
    console.log('✓ Created indexes on audit_logs');

    // Create indexes for subscriptions
    await db.collection('subscriptions').createIndex({ companyId: 1 });
    console.log('✓ Created indexes on subscriptions');

    // Create indexes for sessions
    await db.collection('sessions').createIndex({ companyId: 1 });
    await db.collection('sessions').createIndex({ token: 1 }, { unique: true });
    await db.collection('sessions').createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );
    console.log('✓ Created indexes on sessions');

    console.log('\n✅ Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

initializeDatabase();
