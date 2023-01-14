import { Consumer } from '@jamashita/anden/type';
import { Heisenberg, HeisenbergState } from './Heisenberg.js';
import { HeisenbergError } from './HeisenbergError.js';
import { Lost } from './Lost.js';
import { Present } from './Present.js';

export class Absent<out P> implements Heisenberg<P> {
  private static readonly INSTANCE: Absent<unknown> = new Absent();

  public static of<P>(): Absent<P> {
    return Absent.INSTANCE as Absent<P>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new HeisenbergError('ABSENT');
  }

  public getState(): HeisenbergState {
    return 'ABSENT';
  }

  public ifAbsent(consumer: Consumer<void>): this {
    consumer();

    return this;
  }

  public ifLost(): this {
    return this;
  }

  public ifPresent(): this {
    return this;
  }

  public isAbsent(): this is Absent<P> {
    return true;
  }

  public isLost(): this is Lost<P> {
    return false;
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public serialize(): string {
    return 'Absent';
  }

  public toString(): string {
    return this.serialize();
  }

  public transform<Q>(): Absent<Q> {
    return this as unknown as Absent<Q>;
  }
}
