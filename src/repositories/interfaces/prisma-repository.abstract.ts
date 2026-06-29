import { IBasicRepository } from './basic-repository.interface';

export abstract class PrismaRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
> implements IBasicRepository<TModel, TCreateInput, TUpdateInput> {
  create(data: TCreateInput): Promise<TModel> {
    throw new Error('Method not implemented.');
  }
  update(id: string, data: TUpdateInput): Promise<TModel> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<TModel | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<TModel[]> {
    throw new Error('Method not implemented.');
  }
}
