import { type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import {
    type CreateSemiTrailerInput,
    type UpdateSemiTrailerInput,
} from '../schemas/semi-trailer.schema.js';

const semiTrailerInclude = {
    vehicle: { select: { id: true, licensePlate: true, make: true, model: true } },
} as const;

export const getAllSemiTrailers = async (req: Request, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        const semiTrailers = await prisma.semiTrailer.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: semiTrailerInclude,
        });
        return res.status(200).json(semiTrailers);
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSemiTrailerById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        const semiTrailer = await prisma.semiTrailer.findUnique({
            where: { id_tenantId: { id: req.params.id, tenantId } },
            include: semiTrailerInclude,
        });
        if (!semiTrailer) {
            return res.status(404).json({ message: 'Semi-trailer not found' });
        }
        return res.status(200).json(semiTrailer);
    } catch {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createSemiTrailer = async (
    req: Request<{}, {}, CreateSemiTrailerInput>,
    res: Response,
) => {
    try {
        const tenantId = req.user!.tenantId;
        const semiTrailer = await prisma.semiTrailer.create({
            data: { ...req.body, tenantId },
            include: semiTrailerInclude,
        });
        return res.status(201).json(semiTrailer);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Semi-trailer with this VIN or license plate already exists' });
        }
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const updateSemiTrailer = async (
    req: Request<{ id: string }, {}, UpdateSemiTrailerInput>,
    res: Response,
) => {
    try {
        const tenantId = req.user!.tenantId;
        const semiTrailer = await prisma.semiTrailer.update({
            where: { id_tenantId: { id: req.params.id, tenantId } },
            data: req.body,
            include: semiTrailerInclude,
        });
        return res.status(200).json(semiTrailer);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Semi-trailer not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Semi-trailer with this VIN or license plate already exists' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSemiTrailer = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        await prisma.$transaction(async (tx) => {
            await tx.vehicle.updateMany({
                where: { tenantId, semiTrailerId: req.params.id },
                data: { semiTrailerId: null },
            });
            await tx.semiTrailer.delete({
                where: { id_tenantId: { id: req.params.id, tenantId } },
            });
        });
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Semi-trailer not found' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
