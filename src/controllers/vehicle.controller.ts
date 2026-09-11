import { type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import { type CreateVehicleInput, type UpdateVehicleInput } from '../schemas/vehicle.schema.js';

export const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        const vehicles = await prisma.vehicle.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: { driver: { select: { id: true, firstName: true, lastName: true } } },
        });
        return res.status(200).json(vehicles);
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getVehicleById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        const vehicle = await prisma.vehicle.findUnique({
            where: { id_tenantId: { id: req.params.id, tenantId } },
            include: { driver: true },
        });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        return res.status(200).json(vehicle);
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createVehicle = async (
    req: Request<{}, {}, CreateVehicleInput>,
    res: Response,
) => {
    try {
        const tenantId = req.user!.tenantId;
        const vehicle = await prisma.vehicle.create({
            data: { ...req.body, tenantId },
        });
        return res.status(201).json(vehicle);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Vehicle with this VIN or license plate already exists' });
        }
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const updateVehicle = async (
    req: Request<{ id: string }, {}, UpdateVehicleInput>,
    res: Response,
) => {
    try {
        const tenantId = req.user!.tenantId;
        const vehicle = await prisma.vehicle.update({
            where: { id_tenantId: { id: req.params.id, tenantId } },
            data: req.body,
        });
        return res.status(200).json(vehicle);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Vehicle with this VIN or license plate already exists' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteVehicle = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        await prisma.vehicle.delete({
            where: { id_tenantId: { id: req.params.id, tenantId } },
        });
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
