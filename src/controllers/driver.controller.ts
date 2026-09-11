import { type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import { type CreateDriverInput, type UpdateDriverInput } from '../schemas/driver.schema.js';

export const getAllDrivers = async (req: Request, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        const drivers = await prisma.driver.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: { currentVehicle: { select: { id: true, licensePlate: true, make: true, model: true } } },
        });
        return res.status(200).json(drivers);
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getDriverById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        const driver = await prisma.driver.findUnique({
            where: { id_tenantId: { id: req.params.id, tenantId } },
            include: { currentVehicle: true },
        });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        return res.status(200).json(driver);
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createDriver = async (
    req: Request<{}, {}, CreateDriverInput>,
    res: Response,
) => {
    try {
        const tenantId = req.user!.tenantId;
        const driver = await prisma.driver.create({
            data: { ...req.body, tenantId },
        });
        return res.status(201).json(driver);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Driver with this license number, phone or email already exists' });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ message: 'Referenced vehicle does not exist' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateDriver = async (
    req: Request<{ id: string }, {}, UpdateDriverInput>,
    res: Response,
) => {
    try {
        const tenantId = req.user!.tenantId;
        const driver = await prisma.driver.update({
            where: { id_tenantId: { id: req.params.id, tenantId } },
            data: req.body,
        });
        return res.status(200).json(driver);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Driver not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Driver with this license number, phone or email already exists' });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ message: 'Referenced vehicle does not exist' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteDriver = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        await prisma.driver.delete({
            where: { id_tenantId: { id: req.params.id, tenantId } },
        });
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Driver not found' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
