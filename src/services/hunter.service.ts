import type { Hunter, Prisma } from '../generated/prisma/client';
import type { PrismaBaseRepository } from '../repositories/interfaces/prisma-base-repository.abstract';
import { BaseService } from './base-service.abstract';
import type { IRankCalculator } from './rank-calculator.interface';

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
    repository: PrismaBaseRepository<Hunter, Prisma.HunterCreateInput, Prisma.HunterUpdateInput>,
    private readonly rankCalculator: IRankCalculator
  ) {
    super(repository);
  }

  protected notFoundError(id: string): Error {
    return new HunterNotFoundError(id);
  }

  override async create(data: Prisma.HunterCreateInput): Promise<Hunter> {
    const initialExperience = 0;
    const initialRank = this.rankCalculator.calculate(initialExperience);

    const safeData: Prisma.HunterCreateInput = {
      ...data,
      rank: initialRank,
      experiencePoints: initialExperience,
    };

    return super.create(safeData);
  }

  override async update(id: string, data: Prisma.HunterUpdateInput): Promise<Hunter> {
    const { rank: _rank, experiencePoints: _experiencePoints, ...safeData } = data;

    return super.update(id, safeData);
  }

  async addExperience(hunterId: string, experienceGained: number): Promise<Hunter> {
    const hunter = await this.ensureExists(hunterId);

    const newExperience = hunter.experiencePoints + experienceGained;
    const newRank = this.rankCalculator.calculate(newExperience);

    return this.repository.update(hunterId, {
      experiencePoints: newExperience,
      rank: newRank,
    });
  }
}
