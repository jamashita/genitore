import { Consumer, Noun, Serializable } from '@jamashita/anden-type';
import { Absent } from './Absent';
import { HeisenbergType } from './HeisenbergType';
import { Lost } from './Lost';
import { Matter } from './Matter';
import { Present } from './Present';

export interface Heisenberg<P, N extends HeisenbergType = HeisenbergType> extends Serializable, Noun<N> {
  readonly noun: N;

  get(): Matter<P>;

  ifAbsent(consumer: Consumer<void>): void;

  ifLost(consumer: Consumer<unknown>): void;

  ifPresent(consumer: Consumer<P>): void;

  isAbsent(): this is Absent<P>;

  isLost(): this is Lost<P>;

  isPresent(): this is Present<P>;
}
