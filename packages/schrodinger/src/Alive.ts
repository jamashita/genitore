import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Detoxicated } from './Detoxicated';
import { Schrodinger } from './Schrodinger';

export class Alive<A, D extends Error> implements Schrodinger<A, D> {
  private readonly value: Detoxicated<A>;

  public static of<A, D extends Error>(value: Detoxicated<A>): Alive<A, D> {
    return new Alive(value);
  }

  protected constructor(value: Detoxicated<A>) {
    this.value = value;
  }

  public get(): Detoxicated<A> {
    return this.value;
  }

  public ifAlive(consumer: Consumer<A>): void {
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
