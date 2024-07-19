import { Objet } from '@jamashita/anden/object';
import type { Consumer } from '@jamashita/anden/type';
import type { Alive } from './Alive.js';
import type { Dead } from './Dead.js';
import type { Schrodinger, SchrodingerState } from './Schrodinger.js';

export class Contradiction<out A, out D> implements Schrodinger<A, D> {
  private readonly cause: unknown;

  public static of<A, D>(cause: unknown): Contradiction<A, D> {
    return new Contradiction(cause);
  }

  protected constructor(cause: unknown) {
    this.cause = cause;
  }

  public get(): never {
    throw this.cause;
  }

  public getCause(): unknown {
    return this.cause;
  }

  public getState(): SchrodingerState {
    return 'CONTRADICTION';
  }

  public ifAlive(): this {
    return this;
  }

  public ifContradiction(consumer: Consumer<unknown>): this {
    consumer(this.cause);

    return this;
  }

  public ifDead(): this {
    return this;
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

  public transform<B, E>(): Contradiction<B, E> {
    return this as unknown as Contradiction<B, E>;
  }
}
