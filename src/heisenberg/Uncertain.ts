import type { Absent } from './Absent.js';
import type { Heisenberg, HeisenbergState } from './Heisenberg.js';
import { HeisenbergError } from './HeisenbergError.js';
import type { Lost } from './Lost.js';
import type { Present } from './Present.js';

export class Uncertain<out P> implements Heisenberg<P> {
  private static readonly INSTANCE = new Uncertain<unknown>();

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

  public ifAbsent(): this {
    return this;
  }

  public ifLost(): this {
    return this;
  }

  public ifPresent(): this {
    return this;
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
