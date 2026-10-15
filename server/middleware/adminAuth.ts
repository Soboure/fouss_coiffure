import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const sessions = new Set<string>();

export function createSession(password: string): string | null {
  const expected = process.env.ADMIN_PASSWORD || 'fouss2024';
  if (password !== expected) return null;
  const token = crypto.randomUUID();
  sessions.add(token);
  return token;
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-admin-token'];
  if (!token || !sessions.has(token as string)) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
}
