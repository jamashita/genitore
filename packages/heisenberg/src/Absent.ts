import { Consumer } from '@jamashita/anden-type';
import { HeisenbergError } from './Error/HeisenbergError';
import { Heisenberg } from './Heisenberg';
import { Lost } from './Lost';
import { Present } from './Present';

export class Absent<P> implements Heisenberg<P, 'Absent'> {
  public readonly noun: 'Absent' = 'Absent';

  private static readonly INSTANCE: Absent<unknown> = new Absent<unknown>();

  public static of<PT>(): Absent<PT> {
    return (Absent.INSTANCE as unknown) as Absent<PT>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new HeisenbergError('ABSENT');
  }

  public ifAbsent(consumer: Consumer<void>): void {
    consumer();
  }

  public ifLost(): void {
    // NOOP
  }

  public ifPresent(): void {
    // NOOP
  }

  public isAbsent(): this is Absent<P> {
    return true;
  }

  public isLost(): this is Lost<P> {
    return false;
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public serialize(): string {
    return 'Absent';
  }

  public toString(): string {
    return this.serialize();
  }
}
