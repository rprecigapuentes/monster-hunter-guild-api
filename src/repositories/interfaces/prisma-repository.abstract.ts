import { IBasicRepository } from './basic-repository.interface';

export abstract class PrismaRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
> implements IBasicRepository<TModel, TCreateInput, TUpdateInput> {
  constructor(protected model: any) {}

  async create(data: TCreateInput): Promise<TModel> {
    throw new Error('Method not implemented.');
  }
  async update(id: string, data: TUpdateInput): Promise<TModel> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<TModel | null> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<TModel[]> {
    throw new Error('Method not implemented.');
  }
}
