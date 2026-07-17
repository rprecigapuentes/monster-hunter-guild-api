import { ApplicationError } from './application-error';

export class UnauthorizedOperationError extends ApplicationError {
  readonly statusCode = 401;
}
