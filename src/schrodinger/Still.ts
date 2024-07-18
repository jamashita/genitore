import type { Alive } from './Alive.js';
import type { Contradiction } from './Contradiction.js';
import type { Dead } from './Dead.js';
import type { Schrodinger, SchrodingerState } from './Schrodinger.js';
import { SchrodingerError } from './SchrodingerError.js';

export class Still<out A, out D> implements Schrodinger<A, D> {
  private static readonly INSTANCE: Still<unknown, unknown> = new Still();

  public static of<A, D>(): Still<A, D> {
    return Still.INSTANCE as Still<A, D>;
  }

  protected constructor() {
    // NOOP
  }

  public get(): never {
    throw new SchrodingerError('STILL');
  }

  public getState(): SchrodingerState {
    return 'STILL';
  }

  public ifAlive(): this {
    return this;
  }

  public ifContradiction(): this {
    return this;
  }

  public ifDead(): this {
    return this;
  }

  public isAlive(): this is Alive<A, D> {
    return false;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return false;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }

  public serialize(): string {
    return 'Still';
  }

  public toString(): string {
    return this.serialize();
  }
}
