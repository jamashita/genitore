import { RuntimeError } from '@jamashita/anden-error';

export class UnscharferelationError extends RuntimeError<'UnscharferelationError'> {
  public readonly noun: 'UnscharferelationError' = 'UnscharferelationError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
