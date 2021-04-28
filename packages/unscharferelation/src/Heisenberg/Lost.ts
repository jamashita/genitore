import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { HeisenbergType } from './HeisenbergType';
import { Present } from './Present';

export class Lost<P> implements Heisenberg<P, 'Lost'> {
  public readonly noun: 'Lost' = 'Lost';
  private readonly cause: unknown;

  public static of<PT>(cause: unknown): Lost<PT> {
    return new Lost<PT>(cause);
  }

  private constructor(cause: unknown) {
    this.cause = cause;
  }

  public serialize(): string {
    return `Lost: ${Objet.identify(this.cause)}`;
  }

  public toString(): string {
    return this.serialize();
  }

  public get(): never {
    throw this.cause;
  }

  public status(): HeisenbergType {
    return 'Lost';
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isLost(): this is Lost<P> {
    return true;
  }

  public ifPresent(): void {
    // NOOP
  }

  public ifAbsent(): void {
    // NOOP
  }

  public ifLost(consumer: Consumer<unknown>): void {
    consumer(this.cause);
  }

  public getCause(): unknown {
    return this.cause;
  }
}
