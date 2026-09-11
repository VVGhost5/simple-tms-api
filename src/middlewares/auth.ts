import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@prisma/client';

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set');
    }
    return secret;
}

function isRole(value: unknown): value is Role {
    return value === 'Admin' || value === 'Editor';
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        const token = authHeader.slice('Bearer '.length);
        if (!token) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        const decoded = jwt.verify(token, getJwtSecret());
        if (
            typeof decoded === 'string' ||
            typeof decoded.userId !== 'string' ||
            typeof decoded.tenantId !== 'string' ||
            typeof decoded.email !== 'string' ||
            !isRole(decoded.role)
        ) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        req.user = {
            userId: decoded.userId,
            tenantId: decoded.tenantId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}
