import { z } from 'zod';

const EMISSION_STANDARDS = [
    'EURO_1',
    'EURO_2',
    'EURO_3',
    'EURO_4',
    'EURO_5',
    'EURO_6',
    'EURO_7',
] as const;

const VEHICLE_CATEGORIES = ['N2', 'N3', 'O3', 'O4'] as const;
const OWNERSHIP_TYPES = ['a', 'b', 'special'] as const;

const optionalText = z.string().nullish();
const optionalInt = z.number().int().nullish();
const optionalDate = z.coerce.date().nullish();

export const vehicleDetailsSchema = z.object({
    licensePlate: z.string().trim().min(1),
    make: z.string().trim().min(1),
    model: z.string().trim().min(1),
    type: optionalText,
    commercialDescription: optionalText,
    vinCode: optionalText,
    chassisNumber: optionalText,
    maximumMass: optionalInt,
    emptyMass: optionalInt,
    vehicleCategory: z.enum(VEHICLE_CATEGORIES).nullish(),
    capacity: optionalInt,
    bodyType: optionalText,
    fuelType: optionalText,
    maximumPower: optionalInt,
    emissionStandart: z.enum(EMISSION_STANDARDS).nullish(),
    color: optionalText,
    numberOfSeats: optionalInt,
    specialMarks: optionalText,
    firstRegistrationDate: optionalDate,
    registrationDate: optionalDate,
    surnameOrCompany: optionalText,
    givenNames: optionalText,
    manufacturingYear: optionalInt,
    address: optionalText,
    ownership: z.enum(OWNERSHIP_TYPES).nullish(),
    registrationCode: optionalText,
    periodOfValidity: optionalDate,
    tsc: optionalInt,
});

export const vehicleBodySchema = vehicleDetailsSchema.extend({
    semiTrailer: z.union([z.uuid('Invalid semi-trailer ID'), z.literal('')]).nullish(),
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

export type VehicleDetailsInput = z.infer<typeof vehicleDetailsSchema>;
export type CreateVehicleInput = z.infer<typeof CreateVehicleSchema>['body'];
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleSchema>['body'];
