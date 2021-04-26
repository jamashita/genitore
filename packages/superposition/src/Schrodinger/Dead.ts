import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Schrodinger } from './Schrodinger';
import { SchrodingerType } from './SchrodingerType';

export class Dead<A, D extends Error> implements Schrodinger<A, D, 'Dead'> {
  public readonly noun: 'Dead' = 'Dead';
  private readonly error: D;

  public static of<AT, DT extends Error>(error: DT): Dead<AT, DT> {
    return new Dead<AT, DT>(error);
  }

  protected constructor(error: D) {
    this.error = error;
  }

  public serialize(): string {
    return `Dead: ${Objet.identify(this.error)}`;
  }

  public toString(): string {
    return this.serialize();
  }

  public get(): never {
    throw this.error;
  }

  public status(): SchrodingerType {
    return 'Dead';
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

  public getError(): D {
    return this.error;
  }
}
