import { ObjectId } from 'mongodb';

export type PlanType = 'free' | 'pro';
export type EnvironmentType = 'production' | 'staging' | 'development';
export type ErrorType = 'sdk_error' | 'delivery_error';
export type AlertType = 'email' | 'webhook';
export type AlertTrigger = 'high_error_rate' | 'delivery_failure' | 'usage_limit' | 'api_key_abuse';

// ===== COMPANY/TENANT =====
export interface Company {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  emailVerificationCode?: string;
  emailVerificationCodeExpiresAt?: Date;
  plan: PlanType;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== PROJECT =====
export interface Project {
  _id?: ObjectId;
  companyId: ObjectId;
  name: string;
  environment: EnvironmentType;
  createdAt: Date;
  updatedAt: Date;
}

// ===== API KEY =====
export interface ApiKey {
  _id?: ObjectId;
  projectId: ObjectId;
  key: string; // hashed
  displayKey?: string; // first 8 chars + last 4 chars for display
  isActive: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
}

// ===== EVENT =====
export interface Event {
  _id?: ObjectId;
  projectId: ObjectId;
  userId?: string; // externalUserId
  eventName: string;
  properties: Record<string, any>;
  timestamp: Date;
  environment: EnvironmentType;
  sdkVersion: string;
  userAgent?: string;
  country?: string;
}

// ===== USER (TRACKED USER) =====
export interface TrackedUser {
  _id?: ObjectId;
  projectId: ObjectId;
  externalUserId: string;
  firstSeen: Date;
  lastSeen: Date;
  traits: Record<string, any>;
}

// ===== SDK ERROR =====
export interface SdkError {
  _id?: ObjectId;
  projectId: ObjectId;
  errorType: ErrorType;
  message: string;
  stack?: string;
  environment: EnvironmentType;
  timestamp: Date;
}

// ===== USAGE METER =====
export interface UsageMeter {
  _id?: ObjectId;
  projectId: ObjectId;
  month: Date; // First day of month
  eventCount: number;
  activeUsers: number;
}

// ===== ALERT =====
export interface Alert {
  _id?: ObjectId;
  projectId: ObjectId;
  name: string;
  type: AlertType;
  triggers: AlertTrigger[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== AUDIT LOG =====
export interface AuditLog {
  _id?: ObjectId;
  companyId: ObjectId;
  action: string;
  details: Record<string, any>;
  createdAt: Date;
}

// ===== SUBSCRIPTION =====
export interface Subscription {
  _id?: ObjectId;
  companyId: ObjectId;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  canceledAt?: Date;
}

// ===== SESSION =====
export interface Session {
  _id?: ObjectId;
  companyId: ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
