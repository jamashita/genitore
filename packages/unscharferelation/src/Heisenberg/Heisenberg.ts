import { Consumer, Nominative } from '@jamashita/anden-type';
import { Matter } from '../Interface/Matter';
import { Absent } from './Absent';
import { HeisenbergType } from './HeisenbergType';
import { Lost } from './Lost';
import { Present } from './Present';

export interface Heisenberg<P, N extends HeisenbergType = HeisenbergType> extends Nominative {
  readonly noun: N;

  get(): Matter<P>;

  status(): HeisenbergType;

  isPresent(): this is Present<P>;

  isAbsent(): this is Absent<P>;

  isLost(): this is Lost<P>;

  ifPresent(consumer: Consumer<P>): void;

  ifAbsent(consumer: Consumer<void>): void;

  ifLost(consumer: Consumer<unknown>): void;
}
