import { Objet } from '@jamashita/anden/object';
import type { Consumer } from '@jamashita/anden/type';
import type { Alive } from './Alive.js';
import type { Contradiction } from './Contradiction.js';
import type { Schrodinger, SchrodingerState } from './Schrodinger.js';

export class Dead<out A, out D> implements Schrodinger<A, D> {
  private readonly error: D;

  public static of<A, D>(error: D): Dead<A, D> {
    return new Dead(error);
  }

  protected constructor(error: D) {
    this.error = error;
  }

  public get(): never {
    throw this.error;
  }

  public getError(): D {
    return this.error;
  }

  public getState(): SchrodingerState {
    return 'DEAD';
  }

  public ifAlive(): this {
    return this;
  }

  public ifContradiction(): this {
    return this;
  }

  public ifDead(consumer: Consumer<D>): this {
    consumer(this.error);

    return this;
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

  public transform<B>(): Dead<B, D> {
    return this as unknown as Dead<B, D>;
  }
}
