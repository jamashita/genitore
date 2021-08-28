import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Schrodinger } from './Schrodinger';

export class Dead<A, D extends Error> implements Schrodinger<A, D, 'Dead'> {
  public readonly noun: 'Dead' = 'Dead';
  private readonly error: D;

  public static of<AT, DT extends Error>(error: DT): Dead<AT, DT> {
    return new Dead<AT, DT>(error);
  }

  protected constructor(error: D) {
    this.error = error;
  }

  public get(): never {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.error;
  }

  public ifAlive(): void {
    // NOOP
  }

  public ifContradiction(): void {
    // NOOP
  }

  public ifDead(consumer: Consumer<D>): void {
    consumer(this.error);
  }

  public isAlive(): this is Alive<A, D> {
    return false;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return false;
  }

  public isDead(): this is Dead<A, D> {
    return true;
  }

  public serialize(): string {
    return `Dead: ${Objet.identify(this.error)}`;
  }

  public toString(): string {
    return this.serialize();
  }

  public getError(): D {
    return this.error;
  }
}
