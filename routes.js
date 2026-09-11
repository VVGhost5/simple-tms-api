import { Router } from 'express';

import { 
    getVehicleById, 
    getAllVehicles, 
    addVehicle, 
    deleteVehicle 
} from './controllers/vehicleController.js';


const router = Router();

router.get('/api/vehicle', getAllVehicles);
router.get('/api/vehicle/:id', getVehicleById);
router.post('/api/vehicle', addVehicle);
router.delete('/api/vehicle/:id', deleteVehicle);

router.post('/api/driver/', addD)

export default router;