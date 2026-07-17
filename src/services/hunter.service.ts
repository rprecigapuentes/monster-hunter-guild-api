import type { CreateHunterDto, UpdateHunterDto } from '../dto/hunter.dto';
import type { Hunter, Prisma } from '../generated/prisma/client';
import type { IBasicRepository } from '../repositories/interfaces/basic-repository.interface';
import { BaseService } from './base-service.abstract';
import type { IRankCalculator } from './rank-calculator.interface';
import type { EventManager } from '../events/event-manager';
import { type ISearchableRepository } from '../repositories/interfaces/searchable-repository.interface';
import { type ISearchableService } from './interfaces/searchable-service.interface';
import { type ISearchResult } from './interfaces/search-result.interface';

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

type HunterRepositoryType = IBasicRepository<
  Hunter,
  Prisma.HunterUncheckedCreateInput,
  Prisma.HunterUncheckedUpdateInput
> &
  ISearchableRepository<Hunter>;

export class HunterService
  extends BaseService<
    Hunter,
    Prisma.HunterUncheckedCreateInput,
    Prisma.HunterUncheckedUpdateInput,
    HunterRepositoryType
  >
  implements ISearchableService
{
  private static readonly INITIAL_EXPERIENCE = 0;

  constructor(
    repository: HunterRepositoryType,
    private readonly rankCalculator: IRankCalculator,
    events: EventManager
  ) {
    super(repository, events);
  }
  async search(query: string): Promise<ISearchResult> {
    const trimed = query.trim();
    const data = await this.repository.search(trimed);

    return {
      resourceName: 'Hunters',
      result: data,
    };
  }

  protected get entityName(): string {
    return 'Hunter';
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
