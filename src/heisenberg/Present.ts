import { Objet } from '@jamashita/anden/object';
import { Consumer } from '@jamashita/anden/type';
import { Absent } from './Absent.js';
import { Heisenberg, HeisenbergState } from './Heisenberg.js';
import { Lost } from './Lost.js';

export class Present<out P> implements Heisenberg<P> {
  private readonly value: Exclude<P, null | undefined | void>;

  public static of<P>(value: Exclude<P, null | undefined | void>): Present<P> {
    return new Present(value);
  }

  private constructor(value: Exclude<P, null | undefined | void>) {
    this.value = value;
  }

  public get(): Exclude<P, null | undefined | void> {
    return this.value;
  }

  public getState(): HeisenbergState {
    return 'PRESENT';
  }

  public ifAbsent(): this {
    return this;
  }

  public ifLost(): this {
    return this;
  }

  public ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this {
    consumer(this.value);

    return this;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isLost(): this is Lost<P> {
    return false;
  }

  public isPresent(): this is Present<P> {
    return true;
  }

  public serialize(): string {
    return `Present: ${Objet.identify(this.value)}`;
  }

  public toString(): string {
    return this.serialize();
  }
}
