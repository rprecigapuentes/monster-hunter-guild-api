export class RelatedEntityValidationError extends Error {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} does not exist`);
    this.name = 'RelatedEntityValidationError';
  }
}
