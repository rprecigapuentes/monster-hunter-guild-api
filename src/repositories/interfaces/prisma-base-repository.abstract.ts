import { Prisma } from '../../generated/prisma/client';
import type { IBasicRepository } from './basic-repository.interface';

export interface PrismaModelDelegate<TModel, TCreateInput, TUpdateInput, TWhereInput> {
  create(args: { data: TCreateInput }): Promise<TModel>;
  update(args: { where: { id: string }; data: TUpdateInput }): Promise<TModel>;
  delete(args: { where: { id: string } }): Promise<unknown>;
  findUnique(args: { where: { id: string } }): Promise<TModel | null>;
  findMany(args?: { where?: TWhereInput }): Promise<TModel[]>;
}

export abstract class PrismaBaseRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
  TWhereInput,
> implements IBasicRepository<TModel, TCreateInput, TUpdateInput> {
  constructor(
    protected model: PrismaModelDelegate<TModel, TCreateInput, TUpdateInput, TWhereInput>
  ) {}

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
