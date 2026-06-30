import { Prisma } from '../../generated/prisma/client';
import type { IBasicRepository } from './basic-repository.interface';

export abstract class PrismaRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
> implements IBasicRepository<TModel, TCreateInput, TUpdateInput> {
  constructor(protected model: any) {}

  async create(data: TCreateInput): Promise<TModel> {
    return await this.model.create({ data });
  }
  async update(id: string, data: TUpdateInput): Promise<TModel> {
    return await this.model.update({
      where: { id },
      data,
    });
  }
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.delete({ where: { id } });
      return Boolean(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return false;
        }
      }
      throw error;
    }
  }
  async findById(id: string): Promise<TModel | null> {
    return await this.model.findUnique({
      where: { id },
    });
  }
  async findAll(): Promise<TModel[]> {
    return await this.model.findMany();
  }
}
