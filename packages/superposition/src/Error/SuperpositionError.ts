import { RuntimeError } from '@jamashita/publikum-error';

export class SuperpositionError extends RuntimeError<'SuperpositionError'> {
  public readonly noun: 'SuperpositionError' = 'SuperpositionError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
