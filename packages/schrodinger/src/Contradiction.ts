import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Contradiction<A, D extends Error> implements Schrodinger<A, D, 'Contradiction'> {
  public readonly noun: 'Contradiction' = 'Contradiction';
  private readonly cause: unknown;

  public static of<AT, DT extends Error>(cause: unknown): Contradiction<AT, DT> {
    return new Contradiction<AT, DT>(cause);
  }

  protected constructor(cause: unknown) {
    this.cause = cause;
  }

  public get(): never {
    throw this.cause;
  }

  public ifAlive(): void {
    // NOOP
  }

  public ifContradiction(consumer: Consumer<unknown>): void {
    consumer(this.cause);
  }

  public ifDead(): void {
    // NOOP
  }

  public isAlive(): this is Alive<A, D> {
    return false;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return true;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }

  public serialize(): string {
    return `Contradiction: ${Objet.identify(this.cause)}`;
  }

  public toString(): string {
    return this.serialize();
  }

  public getCause(): unknown {
    return this.cause;
  }
}
