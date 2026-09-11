import express, { type Application, type Request, type Response } from 'express';
import vehicleRoutes from './routes/vehicle.routes.js';
import driverRoutes from './routes/driver.routes.js';
import tripsRoutes from "./routes/trips.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app: Application = express();

app.use(express.json());

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/status', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'API is running successfully!' });
});

export default app;
