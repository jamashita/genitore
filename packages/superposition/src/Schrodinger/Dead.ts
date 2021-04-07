import { Objet, ValueObject } from '@jamashita/anden-object';
import { Consumer, isEqualable } from '@jamashita/anden-type';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Schrodinger } from './Schrodinger';

export class Dead<A, D extends Error> extends ValueObject<'Dead'> implements Schrodinger<A, D, 'Dead'> {
  public readonly noun: 'Dead' = 'Dead';
  private readonly error: D;

  public static of<AT, DT extends Error>(error: DT): Dead<AT, DT> {
    return new Dead<AT, DT>(error);
  }

  protected constructor(error: D) {
    super();
    this.error = error;
  }

  public serialize(): string {
    return `Dead: ${Objet.identify(this.error)}`;
  }

  public get(): never {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.error;
  }

  public isAlive(): this is Alive<A, D> {
    return false;
  }

  public isDead(): this is Dead<A, D> {
    return true;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return false;
  }

  public ifAlive(): void {
    // NOOP
  }

  public ifDead(consumer: Consumer<D>): void {
    consumer(this.error);
  }

  public ifContradiction(): void {
    // NOOP
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Dead)) {
      return false;
    }
    if (this.error === other.error) {
      return true;
    }
    if (isEqualable(this.error)) {
      return this.error.equals(other.error);
    }

    return false;
  }

  public getError(): D {
    return this.error;
  }
}
