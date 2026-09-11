import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { TripParamsSchema, UpdateTripSchema, CreateTripSchema } from '../schemas/trip.schema.js';
import { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip } from '../controllers/trip.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllTrips);
router.get('/:id', validate(TripParamsSchema), getTripById);
router.post('/', validate(CreateTripSchema), createTrip);
router.patch('/:id', validate(UpdateTripSchema), updateTrip);
router.delete('/:id', validate(TripParamsSchema), deleteTrip);

export default router;
