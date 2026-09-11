import { z } from 'zod';

const DRIVER_CATEGORIES = [
    'B1',
    'B',
    'BE',
    'C1',
    'C',
    'C1E',
    'CE',
    'D1',
    'D',
    'D1E',
    'DE',
] as const;
const DRIVER_STATUSES = ['ACTIVE', 'ON_TRIP', 'VACATION', 'INACTIVE'] as const;

export const driverBodySchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    licenseNumber: z.string().min(5).trim().toUpperCase(),
    categories: z
        .array(z.enum(DRIVER_CATEGORIES))
        .min(1, 'At least one driving category is required'),
    phone: z
        .string()
        .regex(/^\+?[0-9\s\-()\u2011]{7,20}$/, 'Invalid phone number format'),
    email: z.string().email().optional(),
    birthDate: z.coerce.date(),
    licenseExpiryDate: z.coerce.date(),
    status: z.enum(DRIVER_STATUSES).default('ACTIVE'),
    currentVehicleId: z.string().uuid('Invalid vehicle ID').optional().nullable(),
});

export const CreateDriverSchema = z.object({
    body: driverBodySchema,
});

export const UpdateDriverSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid driver ID'),
    }),
    body: driverBodySchema.partial(),
});

export const DriverParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid driver ID'),
    }),
});

export type CreateDriverInput = z.infer<typeof CreateDriverSchema>['body'];
export type UpdateDriverInput = z.infer<typeof UpdateDriverSchema>['body'];
