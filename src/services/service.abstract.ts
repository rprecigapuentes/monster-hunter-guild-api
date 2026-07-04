import type { PrismaRepository } from '../repositories/interfaces/prisma-repository.abstract';

export abstract class AbstractService<TModel, TCreateInput, TUpdateInput> {
  constructor(
    protected readonly repository: PrismaRepository<TModel, TCreateInput, TUpdateInput>
  ) {}

  async create(data: TCreateInput): Promise<TModel> {
    await this.validateCreate(data);
    return await this.repository.create(data);
  }

  async update(id: string, data: TUpdateInput): Promise<TModel> {
    await this.ensureExists(id);
    await this.validateUpdate(data);
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    return await this.repository.delete(id);
  }

  async findById(id: string): Promise<TModel | null> {
    await this.ensureExists(id);
    return await this.repository.findById(id);
  }

  async findAll(): Promise<TModel[]> {
    return await this.repository.findAll();
  }

  async ensureExists(id: string): Promise<TModel> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw this.notFoundError(id);
    }
    return entity;
  }

  protected abstract notFoundError(id: string): Error;

  protected async validateCreate(_data: TCreateInput): Promise<void> {}
  protected async validateUpdate(_data: TUpdateInput): Promise<void> {}
}
