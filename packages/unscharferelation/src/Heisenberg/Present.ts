import { Objet, ValueObject } from '@jamashita/anden-object';
import { Consumer, isEqualable } from '@jamashita/anden-type';
import { Matter } from '../Interface/Matter';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { Lost } from './Lost';

export class Present<P> extends ValueObject<'Present'> implements Heisenberg<P, 'Present'> {
  public readonly noun: 'Present' = 'Present';
  private readonly value: Matter<P>;

  public static of<PT>(value: Matter<PT>): Present<PT> {
    return new Present<PT>(value);
  }

  private constructor(value: Matter<P>) {
    super();
    this.value = value;
  }

  public serialize(): string {
    return `Present: ${Objet.identify(this.value)}`;
  }

  public get(): Matter<P> {
    return this.value;
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

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Present)) {
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
