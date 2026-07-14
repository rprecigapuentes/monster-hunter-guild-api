import type { Guild, Prisma } from '../generated/prisma/client';
import type { IBasicRepository } from '../repositories/interfaces/basic-repository.interface';
import { BaseService } from './base-service.abstract';

export class GuildNotFoundError extends Error {
  constructor(id: string) {
    super(`Guild with id ${id} was not found`);
    this.name = 'GuildNotFoundError';
  }
}

export class GuildValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GuildValidationError';
  }
}

export class GuildService extends BaseService<
  Guild,
  Prisma.GuildCreateInput,
  Prisma.GuildUpdateInput
> {
  constructor(
    repository: IBasicRepository<Guild, Prisma.GuildCreateInput, Prisma.GuildUpdateInput>
  ) {
    super(repository);
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
