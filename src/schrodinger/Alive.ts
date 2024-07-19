import { Objet } from '@jamashita/anden/object';
import type { Consumer } from '@jamashita/anden/type';
import type { Contradiction } from './Contradiction.js';
import type { Dead } from './Dead.js';
import type { Schrodinger, SchrodingerState } from './Schrodinger.js';

export class Alive<out A, out D> implements Schrodinger<A, D> {
  private readonly value: A;

  public static of<A, D>(value: A): Alive<A, D> {
    return new Alive(value);
  }

  protected constructor(value: A) {
    this.value = value;
  }

  public get(): A {
    return this.value;
  }

  public getState(): SchrodingerState {
    return 'ALIVE';
  }

  public ifAlive(consumer: Consumer<A>): this {
    consumer(this.value);

    return this;
  }

  public ifContradiction(): this {
    return this;
  }

  public ifDead(): this {
    return this;
  }

  public isAlive(): this is Alive<A, D> {
    return true;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return false;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }

  public serialize(): string {
    return `Alive: ${Objet.identify(this.value)}`;
  }

  public toString(): string {
    return this.serialize();
  }

  public transform<E>(): Alive<A, E> {
    return this as unknown as Alive<A, E>;
  }
}
