import { ApplicationError } from './application-error';

export class BusinessRuleError extends ApplicationError {
  readonly statusCode = 422;
}
