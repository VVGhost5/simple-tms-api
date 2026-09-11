import type { Role } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                tenantId: string;
                email: string;
                role: Role;
            };
        }
    }
}

export {};
