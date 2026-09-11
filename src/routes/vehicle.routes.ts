import { Router } from 'express';
import {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} from '../controllers/vehicle.controller.js';
import { validate } from '../middlewares/validate.js';
import {
    CreateVehicleSchema,
    UpdateVehicleSchema,
    VehicleParamsSchema,
} from '../schemas/vehicle.schema.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllVehicles);
router.get('/:id', validate(VehicleParamsSchema), getVehicleById);
router.post('/', validate(CreateVehicleSchema), createVehicle);
router.patch('/:id', validate(UpdateVehicleSchema), updateVehicle);
router.delete('/:id', validate(VehicleParamsSchema), deleteVehicle);

export default router;
