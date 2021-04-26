import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { HeisenbergType } from './HeisenbergType';
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

  public serialize(): string {
    return 'Uncertain';
  }

  public toString(): string {
    return this.serialize();
  }

  public get(): never {
    throw new UnscharferelationError('UNCERTAIN');
  }

  public status(): HeisenbergType {
    return 'Uncertain';
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
}
