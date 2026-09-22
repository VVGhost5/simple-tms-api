import { type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import { type CreateVehicleInput, type UpdateVehicleInput } from '../schemas/vehicle.schema.js';

const vehicleListInclude = {
    driver: { select: { id: true, firstName: true, lastName: true } },
    semiTrailer: { select: { id: true, licensePlate: true, make: true, model: true } },
} as const;

const vehicleInclude = {
    driver: true,
    semiTrailer: true,
} as const;

type SemiTrailerLinkResult =
    | { ok: true; semiTrailerId?: string | null }
    | { ok: false; status: number; message: string };

async function resolveSemiTrailerLink(
    tenantId: string,
    semiTrailer: string | null | undefined,
    currentVehicleId?: string,
): Promise<SemiTrailerLinkResult> {
    if (semiTrailer === undefined) {
        return { ok: true };
    }

    if (semiTrailer === null || semiTrailer === '') {
        return { ok: true, semiTrailerId: null };
    }

    const trailer = await prisma.semiTrailer.findUnique({
        where: { id_tenantId: { id: semiTrailer, tenantId } },
        select: { id: true },
    });
    if (!trailer) {
        return { ok: false, status: 404, message: 'Semi-trailer not found' };
    }

    const linkedVehicle = await prisma.vehicle.findFirst({
        where: {
            tenantId,
            semiTrailerId: semiTrailer,
            ...(currentVehicleId ? { id: { not: currentVehicleId } } : {}),
        },
        select: { id: true },
    });
    if (linkedVehicle) {
        return { ok: false, status: 409, message: 'Semi-trailer is already linked to another vehicle' };
    }

    return { ok: true, semiTrailerId: semiTrailer };
}

function duplicateVehicleMessage(error: { meta?: { target?: unknown } }) {
    const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(',')
        : String(error.meta?.target ?? '');

    if (target.includes('semiTrailer')) {
        return 'Semi-trailer is already linked to another vehicle';
    }

    return 'Vehicle with this VIN or license plate already exists';
}

export const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const tenantId = req.user!.tenantId;
        const vehicles = await prisma.vehicle.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: vehicleListInclude,
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
            include: vehicleInclude,
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
        const { semiTrailer, ...vehicleData } = req.body;
        const link = await resolveSemiTrailerLink(tenantId, semiTrailer);
        if (!link.ok) {
            return res.status(link.status).json({ message: link.message });
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                ...vehicleData,
                tenantId,
                ...(link.semiTrailerId ? { semiTrailerId: link.semiTrailerId } : {}),
            },
            include: vehicleInclude,
        });
        return res.status(201).json(vehicle);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: duplicateVehicleMessage(error) });
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
        const { semiTrailer, ...vehicleData } = req.body;
        const link = await resolveSemiTrailerLink(tenantId, semiTrailer, req.params.id);
        if (!link.ok) {
            return res.status(link.status).json({ message: link.message });
        }

        const vehicle = await prisma.vehicle.update({
            where: { id_tenantId: { id: req.params.id, tenantId } },
            data: {
                ...vehicleData,
                ...(link.semiTrailerId !== undefined ? { semiTrailerId: link.semiTrailerId } : {}),
            },
            include: vehicleInclude,
        });
        return res.status(200).json(vehicle);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ message: duplicateVehicleMessage(error) });
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
