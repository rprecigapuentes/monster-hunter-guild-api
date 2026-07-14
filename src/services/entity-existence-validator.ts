import type { IExistenceChecker } from './interfaces/existence-checker.interface';
import { RelatedEntityValidationError } from '../errors/related-entity-validation.error';

export class EntityExistenceValidator {
  constructor(
    private readonly checker: IExistenceChecker,
    private readonly entityName: string
  ) {}

  async ensure(id: string): Promise<void> {
    if (!(await this.checker.exists(id))) {
      throw new RelatedEntityValidationError(this.entityName, id);
    }
  }
}
