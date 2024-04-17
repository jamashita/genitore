import { Objet } from '@jamashita/anden/object';
import type { Consumer } from '@jamashita/anden/type';
import type { Absent } from './Absent.js';
import type { Heisenberg, HeisenbergState } from './Heisenberg.js';
import type { Lost } from './Lost.js';

export class Present<out P> implements Heisenberg<P> {
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  private readonly value: Exclude<P, null | undefined | void>;

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public static of<P>(value: Exclude<P, null | undefined | void>): Present<P> {
    return new Present(value);
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  private constructor(value: Exclude<P, null | undefined | void>) {
    this.value = value;
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
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

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
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
