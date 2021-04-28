import { Objet } from '@jamashita/anden-object';
import { Consumer } from '@jamashita/anden-type';
import { Matter } from '../Interface/Matter';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { HeisenbergType } from './HeisenbergType';
import { Lost } from './Lost';

export class Present<P> implements Heisenberg<P, 'Present'> {
  public readonly noun: 'Present' = 'Present';
  private readonly value: Matter<P>;

  public static of<PT>(value: Matter<PT>): Present<PT> {
    return new Present<PT>(value);
  }

  private constructor(value: Matter<P>) {
    this.value = value;
  }

  public serialize(): string {
    return `Present: ${Objet.identify(this.value)}`;
  }

  public toString(): string {
    return this.serialize();
  }

  public get(): Matter<P> {
    return this.value;
  }

  public status(): HeisenbergType {
    return 'Present';
  }

  public isPresent(): this is Present<P> {
    return true;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isLost(): this is Lost<P> {
    return false;
  }

  public ifPresent(consumer: Consumer<P>): void {
    consumer(this.value);
  }

  public ifAbsent(): void {
    // NOOP
  }

  public ifLost(): void {
    // NOOP
  }
}
