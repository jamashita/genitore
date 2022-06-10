import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Absent } from './Absent';
import { Heisenberg, HeisenbergState } from './Heisenberg';
import { Present } from './Present';

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

  public ifAbsent(): void {
    // NOOP
  }

  public ifLost(consumer: Consumer<unknown>): void {
    consumer(this.cause);
  }

  public ifPresent(): void {
    // NOOP
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
}
