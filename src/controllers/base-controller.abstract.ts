import type { Request, Response, NextFunction } from 'express';
import type { BaseService } from '../services/base-service.abstract'; //in development process

export abstract class BaseController<TModel, TCreateInput, TUpdateInput> {
  constructor(protected readonly service: BaseService<TModel, TCreateInput, TUpdateInput>) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const entity = await this.service.create(req.body as TCreateInput);
      res.status(201).json(entity);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const entity = await this.service.update(req.params.id, req.body as TUpdateInput);

      res.status(200).json(entity);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.delete(req.params.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const entity = await this.service.findById(req.params.id);
      res.status(200).json(entity);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const entities = await this.service.findAll();
      res.status(200).json(entities);
    } catch (error) {
      next(error);
    }
  };
}
