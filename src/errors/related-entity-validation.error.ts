import { ValidationError } from './validation.error';

export class RelatedEntityValidationError extends ValidationError {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} does not exist`);
  }
}
