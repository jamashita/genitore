import { Absent } from './Absent';
import { HeisenbergError } from './Error/HeisenbergError';
import { Heisenberg } from './Heisenberg';
import { Lost } from './Lost';
import { Present } from './Present';

export class Uncertain<P> implements Heisenberg<P, 'Uncertain'> {
  public readonly noun: 'Uncertain' = 'Uncertain';

  private static readonly INSTANCE: Uncertain<unknown> = new Uncertain<unknown>();

  public static of<PT>(): Uncertain<PT> {
    return (Uncertain.INSTANCE as unknown) as Uncertain<PT>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new HeisenbergError('UNCERTAIN');
  }

  public ifAbsent(): void {
    // NOOP
  }

  public ifLost(): void {
    // NOOP
  }

  public ifPresent(): void {
    // NOOP
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isLost(): this is Lost<P> {
    return false;
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public serialize(): string {
    return 'Uncertain';
  }

  public toString(): string {
    return this.serialize();
  }
}
