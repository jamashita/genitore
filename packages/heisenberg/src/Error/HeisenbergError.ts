import { RuntimeError } from '@jamashita/anden-error';

export class HeisenbergError extends RuntimeError<'HeisenbergError'> {
  public readonly noun: 'HeisenbergError' = 'HeisenbergError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
