import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            return next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.issues.map((issue) => ({
                    field: issue.path.slice(1).join('.'),
                    message: issue.message,
                }));
                return res.status(400).json({ message: 'Validation error', errors });
            }
            return res.status(400).json({ message: 'Validation error' });
        }
    };
