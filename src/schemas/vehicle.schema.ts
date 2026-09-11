import { z } from 'zod';

const FUEL_TYPES = ['Diesel', 'Gasoline', 'Electric', 'Hybrid', 'CNG/LPG'] as const;
const VEHICLE_TYPES = ['Truck', 'Van', 'Semi-truck', 'Pickup', 'Tanker', 'Refrigerator'] as const;

export const vehicleBodySchema = z.object({
    licensePlate: z
        .string()
        .length(8, 'License plate must be 8 characters long')
        .trim()
        .toUpperCase(),
    make: z.string().min(2),
    model: z.string().min(2),
    type: z.enum(VEHICLE_TYPES),
    year: z.number().int().min(1900).max(new Date().getFullYear()),
    vin: z
        .string()
        .length(17, 'VIN must be 17 characters long')
        .trim()
        .toUpperCase(),
    fullWeight: z.number().positive(),
    emptyWeight: z.number().positive(),
    fuelType: z.enum(FUEL_TYPES),
    registrationCode: z.string().min(5).trim().toUpperCase(),
});

export const CreateVehicleSchema = z.object({
    body: vehicleBodySchema,
});

export const UpdateVehicleSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid vehicle ID'),
    }),
    body: vehicleBodySchema.partial(),
});

export const VehicleParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid vehicle ID'),
    }),
});

export type CreateVehicleInput = z.infer<typeof CreateVehicleSchema>['body'];
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleSchema>['body'];
