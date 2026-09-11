import { z } from 'zod';

const TRIP_STATUSES = [
    'Planned',
    'Loading',
    'Customs',
    'InTransitToPickup',
    'InTransitToDelivery',
    'Delivered',
    'Completed',
    'Cancelled',
] as const;

const loadSchema = z.object({
    date: z.coerce.date(),
    location: z.string(),
})


const tripBodySchema = z.object({
    driverId: z.uuid(),
    vehicleId: z.uuid(),
    loads: z.array(loadSchema),
    unloads: z.array(loadSchema),
    status: z.enum(TRIP_STATUSES)
})

export const CreateTripSchema = z.object({
    body: tripBodySchema,
});

export const UpdateTripSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid trip ID'),
    }),
    body: tripBodySchema.partial(),
});

export const TripParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid trip ID'),
    }),
});

export type CreateTripInput = z.infer<typeof CreateTripSchema>['body'];
export type UpdateTripInput = z.infer<typeof UpdateTripSchema>['body'];
