import crypto from 'crypto';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function maskApiKey(key: string): string {
  return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
}

// Alias for compatibility
export const createSessionToken = generateSessionToken;
