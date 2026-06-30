import type { Request, Response } from 'express';
import type { Prisma } from '../generated/prisma/client';
import type { HunterService } from '../services/hunter.service';
import { HunterNotFoundError, HunterValidationError } from '../services/hunter.service';

export class HunterController {
    constructor(private readonly hunterService: HunterService) {}

    create = async (req: Request, res: Response): Promise<void> => {
        try {
        const data: Prisma.HunterCreateInput = req.body;
        const hunter = await this.hunterService.create(data);
        res.status(201).json(hunter);
        } catch (error) {
        this.handleError(error, res);
        }
    };

    update = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
        const data: Prisma.HunterUpdateInput = req.body;
        const hunter = await this.hunterService.update(req.params.id, data);
        res.status(200).json(hunter);
        } catch (error) {
        this.handleError(error, res);
        }
    };

    delete = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
        await this.hunterService.delete(req.params.id);
        res.status(204).send();
        } catch (error) {
        this.handleError(error, res);
        }
    };

    findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
        const hunter = await this.hunterService.findById(req.params.id);
        res.status(200).json(hunter);
        } catch (error) {
        this.handleError(error, res);
        }
    };

    findAll = async (_req: Request, res: Response): Promise<void> => {
        try {
        const hunters = await this.hunterService.findAll();
        res.status(200).json(hunters);
        } catch (error) {
        this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof HunterNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
        }
        if (error instanceof HunterValidationError) {
        res.status(400).json({ message: error.message });
        return;
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}