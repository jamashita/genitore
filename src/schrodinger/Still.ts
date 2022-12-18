import { Alive } from './Alive.js';
import { Contradiction } from './Contradiction.js';
import { Dead } from './Dead.js';
import { Schrodinger, SchrodingerState } from './Schrodinger.js';
import { SchrodingerError } from './SchrodingerError.js';

export class Still<out A, out D extends Error> implements Schrodinger<A, D> {
  private static readonly INSTANCE: Still<unknown, Error> = new Still();

  public static of<A, D extends Error>(): Still<A, D> {
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

  public ifAlive(): void {
    // NOOP
  }

  public ifContradiction(): void {
    // NOOP
  }

  public ifDead(): void {
    // NOOP
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
