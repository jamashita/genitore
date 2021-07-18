import { RuntimeError } from '@jamashita/anden-error';

export class SchrodingerError extends RuntimeError<'SchrodingerError'> {
  public readonly noun: 'SchrodingerError' = 'SchrodingerError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
