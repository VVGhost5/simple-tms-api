import { z } from 'zod';

const credentialsSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(128),
});

export const RegisterSchema = z.object({
    body: credentialsSchema
        .extend({
            companyName: z.string().trim().min(2).max(100),
        })
        .strict(),
});

export const LoginSchema = z.object({
    body: credentialsSchema.strict(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>['body'];
export type LoginInput = z.infer<typeof LoginSchema>['body'];
