import { CreateHunterDto, UpdateHunterDto } from '../dto/hunter.dto';
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
  Prisma.HunterUncheckedCreateInput,
  Prisma.HunterUncheckedUpdateInput
> {
  private static readonly INITIAL_EXPERIENCE = 0;
  
  constructor(
    repository: PrismaBaseRepository<
      Hunter,
      Prisma.HunterUncheckedCreateInput,
      Prisma.HunterUncheckedUpdateInput
    >,
    private readonly rankCalculator: IRankCalculator
  ) {
    super(repository);
  }

  protected notFoundError(id: string): Error {
    return new HunterNotFoundError(id);
  }

  override async create(data: CreateHunterDto): Promise<Hunter> {
    const initialRank = this.rankCalculator.calculate(HunterService.INITIAL_EXPERIENCE);
    const fullData: Prisma.HunterUncheckedCreateInput = {
      ...data,
      rank: initialRank,
      experiencePoints: HunterService.INITIAL_EXPERIENCE,
    };

    return super.create(fullData);
  }

  override async update(id: string, data: UpdateHunterDto): Promise<Hunter> {
    return super.update(id, data);
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
