import { cookies } from 'next/headers';
import { getDatabase } from './db';
import { Company, Session } from './types';
import { ObjectId } from 'mongodb';

const SESSION_COOKIE_NAME = 'analytics-session';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createSession(companyId: ObjectId): Promise<string> {
  const db = await getDatabase();
  const token = require('crypto').randomBytes(32).toString('hex');

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.collection('sessions').insertOne({
    companyId,
    token,
    expiresAt,
    createdAt: new Date(),
  });

  return token;
}

export async function getSessionCompany(): Promise<Company | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const db = await getDatabase();
    const session = await db.collection('sessions').findOne({
      token,
      expiresAt: { $gt: new Date() },
    }) as Session | null;

    if (!session) {
      return null;
    }

    const company = await db.collection('companies').findOne({
      _id: session.companyId,
    }) as Company | null;

    return company || null;
  } catch (error) {
    console.error('Error getting session company:', error);
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function deleteSession(token: string): Promise<void> {
  const db = await getDatabase();
  await db.collection('sessions').deleteOne({ token });
}

export function requireAuth(fn: Function) {
  return async (...args: any[]) => {
    const company = await getSessionCompany();
    if (!company) {
      throw new Error('Unauthorized');
    }
    return fn({ company, ...args });
  };
}
