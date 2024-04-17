import { Objet } from '@jamashita/anden/object';
import type { Consumer } from '@jamashita/anden/type';
import type { Contradiction } from './Contradiction.js';
import type { Dead } from './Dead.js';
import type { Schrodinger, SchrodingerState } from './Schrodinger.js';

export class Alive<out A, out D extends Error> implements Schrodinger<A, D> {
  private readonly value: Exclude<A, Error>;

  public static of<A, D extends Error>(value: Exclude<A, Error>): Alive<A, D> {
    return new Alive(value);
  }

  protected constructor(value: Exclude<A, Error>) {
    this.value = value;
  }

  public get(): Exclude<A, Error> {
    return this.value;
  }

  public getState(): SchrodingerState {
    return 'ALIVE';
  }

  public ifAlive(consumer: Consumer<Exclude<A, Error>>): this {
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

  public transform<E extends Error>(): Alive<A, E> {
    return this as unknown as Alive<A, E>;
  }
}
