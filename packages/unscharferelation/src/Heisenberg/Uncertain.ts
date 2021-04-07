import { ValueObject } from '@jamashita/anden-object';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { Lost } from './Lost';
import { Present } from './Present';

export class Uncertain<P> extends ValueObject<'Uncertain'> implements Heisenberg<P, 'Uncertain'> {
  public readonly noun: 'Uncertain' = 'Uncertain';

  private static readonly INSTANCE: Uncertain<unknown> = new Uncertain<unknown>();

  public static of<PT>(): Uncertain<PT> {
    return (Uncertain.INSTANCE as unknown) as Uncertain<PT>;
  }

  private constructor() {
    super();
  }

  public serialize(): string {
    return 'Uncertain';
  }

  public get(): never {
    throw new UnscharferelationError('UNCERTAIN');
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isLost(): this is Lost<P> {
    return false;
  }

  public ifPresent(): void {
    // NOOP
  }

  public ifAbsent(): void {
    // NOOP
  }

  public ifLost(): void {
    // NOOP
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }
}
