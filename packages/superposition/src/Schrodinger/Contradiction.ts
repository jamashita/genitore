import { isEqualable } from '@jamashita/publikum-interface';
import { Objet, ValueObject } from '@jamashita/publikum-object';
import { Consumer } from '@jamashita/publikum-type';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Contradiction<A, D extends Error> extends ValueObject<'Contradiction'> implements Schrodinger<A, D, 'Contradiction'> {
  public readonly noun: 'Contradiction' = 'Contradiction';
  private readonly cause: unknown;

  public static of<AT, DT extends Error>(cause: unknown): Contradiction<AT, DT> {
    return new Contradiction<AT, DT>(cause);
  }

  protected constructor(cause: unknown) {
    super();
    this.cause = cause;
  }

  public serialize(): string {
    return `Contradiction: ${Objet.identify(this.cause)}`;
  }

  public get(): never {
    throw this.cause;
  }

  public isAlive(): this is Alive<A, D> {
    return false;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return true;
  }

  public ifAlive(): void {
    // NOOP
  }

  public ifDead(): void {
    // NOOP
  }

  public ifContradiction(consumer: Consumer<unknown>): void {
    consumer(this.cause);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Contradiction)) {
      return false;
    }
    if (this.cause === other.cause) {
      return true;
    }
    if (isEqualable(this.cause)) {
      return this.cause.equals(other.cause);
    }

    return false;
  }

  public getCause(): unknown {
    return this.cause;
  }
}
