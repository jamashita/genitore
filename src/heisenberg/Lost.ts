import { Objet } from '@jamashita/anden/object';
import type { Consumer } from '@jamashita/anden/type';
import type { Absent } from './Absent.js';
import type { Heisenberg, HeisenbergState } from './Heisenberg.js';
import type { Present } from './Present.js';

export class Lost<out P> implements Heisenberg<P> {
  private readonly cause: unknown;

  public static of<P>(cause: unknown): Lost<P> {
    return new Lost(cause);
  }

  private constructor(cause: unknown) {
    this.cause = cause;
  }

  public get(): never {
    throw this.cause;
  }

  public getCause(): unknown {
    return this.cause;
  }

  public getState(): HeisenbergState {
    return 'LOST';
  }

  public ifAbsent(): this {
    return this;
  }

  public ifLost(consumer: Consumer<unknown>): this {
    consumer(this.cause);

    return this;
  }

  public ifPresent(): this {
    return this;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isLost(): this is Lost<P> {
    return true;
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public serialize(): string {
    return `Lost: ${Objet.identify(this.cause)}`;
  }

  public toString(): string {
    return this.serialize();
  }

  public transform<Q>(): Lost<Q> {
    return this as unknown as Lost<Q>;
  }
}
