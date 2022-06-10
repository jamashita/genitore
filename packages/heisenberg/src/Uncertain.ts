import { Absent } from './Absent';
import { Heisenberg, HeisenbergState } from './Heisenberg';
import { HeisenbergError } from './HeisenbergError';
import { Lost } from './Lost';
import { Present } from './Present';

export class Uncertain<out P> implements Heisenberg<P> {
  private static readonly INSTANCE: Uncertain<unknown> = new Uncertain();

  public static of<P>(): Uncertain<P> {
    return Uncertain.INSTANCE as Uncertain<P>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new HeisenbergError('UNCERTAIN');
  }

  public getState(): HeisenbergState {
    return 'UNCERTAIN';
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
