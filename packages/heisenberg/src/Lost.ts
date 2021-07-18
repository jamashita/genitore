import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Absent } from './Absent.js';
import { Heisenberg } from './Heisenberg.js';
import { Present } from './Present.js';

export class Lost<P> implements Heisenberg<P, 'Lost'> {
  public readonly noun: 'Lost' = 'Lost';
  private readonly cause: unknown;

  public static of<PT>(cause: unknown): Lost<PT> {
    return new Lost<PT>(cause);
  }

  private constructor(cause: unknown) {
    this.cause = cause;
  }

  public get(): never {
    throw this.cause;
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

  public getCause(): unknown {
    return this.cause;
  }
}
