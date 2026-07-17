import type { Guild, Prisma } from '../generated/prisma/client';
import type { IBasicRepository } from '../repositories/interfaces/basic-repository.interface';
import { BaseService } from './base-service.abstract';
import type { EventManager } from '../events/event-manager';
import { type ISearchableRepository } from '../repositories/interfaces/searchable-repository.interface';
import { type ISearchableService } from './interfaces/searchable-service.interface';
import { type ISearchResult } from './interfaces/search-result.interface';
import { NotFoundError, ValidationError } from '../errors';

export class GuildNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Guild with id ${id} was not found`);
  }
}

export class GuildValidationError extends ValidationError {
  constructor(message: string) {
    super(message);
  }
}
type GuildRepositoryType = IBasicRepository<
  Guild,
  Prisma.GuildCreateInput,
  Prisma.GuildUpdateInput
> &
  ISearchableRepository<Guild>;
export class GuildService
  extends BaseService<Guild, Prisma.GuildCreateInput, Prisma.GuildUpdateInput, GuildRepositoryType>
  implements ISearchableService
{
  constructor(repository: GuildRepositoryType, events: EventManager) {
    super(repository, events);
  }
  async search(query: string): Promise<ISearchResult> {
    const data = await this.repository.search(query);
    return {
      resourceName: 'Guilds',
      result: data,
    };
  }

  protected get entityName(): string {
    return 'Guild';
  }

  protected notFoundError(id: string): Error {
    return new GuildNotFoundError(id);
  }

  protected override async validateCreate(data: Prisma.GuildCreateInput): Promise<void> {
    this.validateName(data.name);
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new GuildValidationError('Guild name is required');
    }
  }
}
