import { type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import { type CreateTripInput, type UpdateTripInput } from '../schemas/trip.schema.js';

const tripInclude = {
    driver: { select: { id: true, firstName: true, lastName: true } },
    vehicle: { select: { id: true, licensePlate: true, make: true, model: true } },
    loads: true,
    unloads: true,
} as const;

export const getAllTrips = async (req: Request, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        const trips = await prisma.trip.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: tripInclude,
        });
        return res.status(200).json(trips);
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTripById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        const trip = await prisma.trip.findUnique({
            where: { id_tenantId: { id: req.params.id, tenantId } },
            include: tripInclude,
        });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json(trip);
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createTrip = async (
    req: Request<{}, {}, CreateTripInput>,
    res: Response,
) => {
    try {
        const tenantId = req.user!.tenantId;
        const { loads, unloads, ...tripData } = req.body;
        const trip = await prisma.trip.create({
            data: {
                ...tripData,
                tenantId,
                loads: { create: loads },
                unloads: { create: unloads },
            },
            include: tripInclude,
        });
        return res.status(201).json(trip);
    } catch (error: any) {
        if (error.code === 'P2003') {
            return res.status(400).json({ message: 'Referenced driver or vehicle does not exist' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTrip = async (
    req: Request<{ id: string }, {}, UpdateTripInput>,
    res: Response,
) => {
    try {
        const tenantId = req.user!.tenantId;
        const { loads, unloads, ...tripData } = req.body;
        const trip = await prisma.trip.update({
            where: { id_tenantId: { id: req.params.id, tenantId } },
            data: {
                ...tripData,
                ...(loads
                    ? { loads: { deleteMany: {}, create: loads } }
                    : {}),
                ...(unloads
                    ? { unloads: { deleteMany: {}, create: unloads } }
                    : {}),
            },
            include: tripInclude,
        });
        return res.status(200).json(trip);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Trip not found' });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ message: 'Referenced driver or vehicle does not exist' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTrip = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        await prisma.trip.delete({
            where: { id_tenantId: { id: req.params.id, tenantId } },
        });
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
