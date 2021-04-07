import { Objet, ValueObject } from '@jamashita/anden-object';
import { Consumer, isEqualable } from '@jamashita/anden-type';
import { Detoxicated } from '../Interface/Detoxicated';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Alive<A, D extends Error> extends ValueObject<'Alive'> implements Schrodinger<A, D, 'Alive'> {
  public readonly noun: 'Alive' = 'Alive';
  private readonly value: Detoxicated<A>;

  public static of<AT, DT extends Error>(value: Detoxicated<AT>): Alive<AT, DT> {
    return new Alive<AT, DT>(value);
  }

  protected constructor(value: Detoxicated<A>) {
    super();
    this.value = value;
  }

  public serialize(): string {
    return `Alive: ${Objet.identify(this.value)}`;
  }

  public get(): Detoxicated<A> {
    return this.value;
  }

  public isAlive(): this is Alive<A, D> {
    return true;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return false;
  }

  public ifAlive(consumer: Consumer<A>): void {
    consumer(this.value);
  }

  public ifDead(): void {
    // NOOP
  }

  public ifContradiction(): void {
    // NOOP
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Alive)) {
      return false;
    }
    if (this.value === other.value) {
      return true;
    }
    if (isEqualable(this.value)) {
      return this.value.equals(other.value);
    }

    return false;
  }
}
