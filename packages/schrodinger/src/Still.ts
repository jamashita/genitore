import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';
import { SchrodingerError } from './SchrodingerError';

export class Still<A, D extends Error> implements Schrodinger<A, D> {
  private static readonly INSTANCE: Still<unknown, Error> = new Still<unknown, Error>();

  public static of<A, D extends Error>(): Still<A, D> {
    return Still.INSTANCE as Still<A, D>;
  }

  protected constructor() {
    // NOOP
  }

  public get(): never {
    throw new SchrodingerError('STILL');
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
