import { type Request, type Response } from 'express';
import type { SignOptions } from 'jsonwebtoken';
import { Prisma, type Role } from '@prisma/client';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { LoginInput, RegisterInput } from '../schemas/user.schema.js';

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set');
    }
    return secret;
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
}

function signToken(payload: { userId: string; tenantId: string; email: string; role: Role }): string {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'],
    });
}

export const login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = signToken({
            userId: user.id,
            tenantId: user.tenantId,
            email: user.email,
            role: user.role,
        });

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ error: errorMessage(error), message: 'Internal Server Error' });
    }
};

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
    try {
        const { email, password, companyName } = req.body;
        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: { name: companyName },
            });

            return tx.user.create({
                data: {
                    email,
                    password: passwordHash,
                    tenantId: tenant.id,
                    role: 'Admin',
                },
            });
        });

        const token = signToken({
            userId: user.id,
            tenantId: user.tenantId,
            email: user.email,
            role: user.role,
        });

        return res.status(201).json({ token });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ message: 'User already exists' });
        }
        return res.status(500).json({ error: errorMessage(error), message: 'Internal Server Error' });
    }
};
