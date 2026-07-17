import type { CreateHunterDto, UpdateHunterDto } from '../dto/hunter.dto';
import type { Hunter, Prisma } from '../generated/prisma/client';
import type { IBasicRepository } from '../repositories/interfaces/basic-repository.interface';
import { BaseService } from './base-service.abstract';
import type { EventManager } from '../events/event-manager';
import type { IRankCalculationStrategy } from '../strategies/rank/interfaces/rank-calculation-strategy.interface';
import { NotFoundError, ValidationError } from '../errors';

export class HunterNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Hunter with id ${id} not found`);
  }
}

export class HunterValidationError extends ValidationError {
  constructor(message: string) {
    super(message);
  }
}

export class HunterService extends BaseService<
  Hunter,
  Prisma.HunterUncheckedCreateInput,
  Prisma.HunterUncheckedUpdateInput
> {
  private static readonly INITIAL_EXPERIENCE = 0;

  constructor(
    repository: IBasicRepository<
      Hunter,
      Prisma.HunterUncheckedCreateInput,
      Prisma.HunterUncheckedUpdateInput
    >,
    private readonly rankStrategy: IRankCalculationStrategy,
    events: EventManager
  ) {
    super(repository, events);
  }

  protected get entityName(): string {
    return 'Hunter';
  }

  protected notFoundError(id: string): Error {
    return new HunterNotFoundError(id);
  }

  override async create(data: CreateHunterDto): Promise<Hunter> {
    const initialRank = this.rankStrategy.calculate(HunterService.INITIAL_EXPERIENCE);
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
    const newRank = this.rankStrategy.calculate(newExperience);

    const updated = await this.repository.update(hunterId, {
      experiencePoints: newExperience,
      rank: newRank,
    });

    await this.events.notify(`hunter.rewarded`, {
      operation: 'REWARDED',
      entity: this.entityName,
      entityId: hunterId,
    });

    if (newRank !== hunter.rank) {
      await this.events.notify(`hunter.ranked_up`, {
        operation: 'RANKED_UP',
        entity: this.entityName,
        entityId: hunterId,
      });
    }

    return updated;
  }
}
