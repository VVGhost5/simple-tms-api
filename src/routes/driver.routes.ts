import { Router } from 'express';
import {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
} from '../controllers/driver.controller.js';
import { validate } from '../middlewares/validate.js';
import {
    CreateDriverSchema,
    UpdateDriverSchema,
    DriverParamsSchema,
} from '../schemas/driver.schema.js';
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);

router.get('/', getAllDrivers);
router.get('/:id', validate(DriverParamsSchema), getDriverById);
router.post('/', validate(CreateDriverSchema), createDriver);
router.patch('/:id', validate(UpdateDriverSchema), updateDriver);
router.delete('/:id', validate(DriverParamsSchema), deleteDriver);

export default router;
