import { z } from 'zod';
import { vehicleDetailsSchema } from './vehicle.schema.js';

export const CreateSemiTrailerSchema = z.object({
    body: vehicleDetailsSchema,
});

export const UpdateSemiTrailerSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid semi-trailer ID'),
    }),
    body: vehicleDetailsSchema.partial(),
});

export const SemiTrailerParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid semi-trailer ID'),
    }),
});

export type CreateSemiTrailerInput = z.infer<typeof CreateSemiTrailerSchema>['body'];
export type UpdateSemiTrailerInput = z.infer<typeof UpdateSemiTrailerSchema>['body'];
