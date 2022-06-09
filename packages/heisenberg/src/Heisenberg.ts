import { Consumer, Serializable } from '@jamashita/anden-type';
import { Absent } from './Absent';
import { Lost } from './Lost';
import { Present } from './Present';

export type HeisenbergState = 'ABSENT' | 'LOST' | 'PRESENT' | 'UNCERTAIN';

export interface Heisenberg<in out P> extends Serializable {
  get(): Exclude<P, null | undefined | void>;

  getState(): HeisenbergState;

  ifAbsent(consumer: Consumer<void>): void;

  ifLost(consumer: Consumer<unknown>): void;

  ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): void;

  isAbsent(): this is Absent<P>;

  isLost(): this is Lost<P>;

  isPresent(): this is Present<P>;
}
