import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Absent } from './Absent';
import { Heisenberg, HeisenbergState } from './Heisenberg';
import { Lost } from './Lost';
import { Matter } from './Matter';

export class Present<P> implements Heisenberg<P> {
  private readonly value: Matter<P>;

  public static of<P>(value: Matter<P>): Present<P> {
    return new Present(value);
  }

  private constructor(value: Matter<P>) {
    this.value = value;
  }

  public get(): Matter<P> {
    return this.value;
  }

  public getState(): HeisenbergState {
    return 'PRESENT';
  }

  public ifAbsent(): void {
    // NOOP
  }

  public ifLost(): void {
    // NOOP
  }

  public ifPresent(consumer: Consumer<P>): void {
    consumer(this.value);
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
