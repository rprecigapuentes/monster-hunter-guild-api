import type { Hunter, Prisma } from '../generated/prisma/client';
import type { PrismaBaseRepository } from '../repositories/interfaces/prisma-base-repository.abstract';
import { BaseService } from './base-service.abstract';

export class HunterNotFoundError extends Error {
  constructor(id: string) {
    super(`Hunter with id ${id} not found`);
    this.name = `HunterNotFoundError`;
  }
}

export class HunterValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = `HunterValidationError`;
  }
}

export class HunterService extends BaseService<
  Hunter,
  Prisma.HunterCreateInput,
  Prisma.HunterUpdateInput
> {
  constructor(
    repository: PrismaBaseRepository<Hunter, Prisma.HunterCreateInput, Prisma.HunterUpdateInput>
  ) {
    super(repository);
  }

  protected notFoundError(id: string): Error {
    return new HunterNotFoundError(id);
  }
}
