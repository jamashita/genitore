import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Schrodinger, SchrodingerState } from './Schrodinger';

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

  public ifAlive(consumer: Consumer<Exclude<A, Error>>): void {
    consumer(this.value);
  }

  public ifContradiction(): void {
    // NOOP
  }

  public ifDead(): void {
    // NOOP
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
}
