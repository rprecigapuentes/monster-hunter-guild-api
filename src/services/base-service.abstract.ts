import type { IBasicRepository } from '../repositories/interfaces/basic-repository.interface';
import type { IExistenceChecker } from './interfaces/existence-checker.interface';
import type { EventManager } from '../events/event-manager';

export abstract class BaseService<TModel, TCreateInput, TUpdateInput> implements IExistenceChecker {
  constructor(
    protected readonly repository: IBasicRepository<TModel, TCreateInput, TUpdateInput>,
    protected readonly events: EventManager
  ) {}

  protected abstract get entityName(): string;

  async create(data: TCreateInput): Promise<TModel> {
    await this.validateCreate(data);
    const created = await this.repository.create(data);
    await this.events.notify(`entity.created`, {
      operation: 'CREATED',
      entity: this.entityName,
      entityId: (created as { id: string }).id,
    });
    return created;
  }

  async update(id: string, data: TUpdateInput): Promise<TModel> {
    const quest = await this.ensureExists(id);
    await this.validateUpdate(quest, data);
    const updated = await this.repository.update(id, data);
    await this.events.notify(`entity.updated`, {
      operation: 'UPDATED',
      entity: this.entityName,
      entityId: id,
    });
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureExists(id);
    const deleted = await this.repository.delete(id);
    await this.events.notify(`entity.deleted`, {
      operation: 'DELETED',
      entity: this.entityName,
      entityId: id,
    });
    return deleted;
  }

  async findById(id: string): Promise<TModel | null> {
    return await this.ensureExists(id);
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

  async exists(id: string): Promise<boolean> {
    return (await this.repository.findById(id)) !== null;
  }

  protected abstract notFoundError(id: string): Error;

  protected async validateCreate(_data: TCreateInput): Promise<void> {}
  protected async validateUpdate(_existing: TModel, _data: TUpdateInput): Promise<void> {}
}
