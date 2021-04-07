import { Nominative, Consumer } from '@jamashita/anden-type';

import { Matter } from '../Interface/Matter';
import { Absent } from './Absent';
import { Lost } from './Lost';
import { Present } from './Present';

type HeisenbergType = 'Absent' | 'Lost' | 'Present' | 'Uncertain';

export interface Heisenberg<P, N extends HeisenbergType = HeisenbergType> extends Nominative {
  readonly noun: N;

  get(): Matter<P>;

  isPresent(): this is Present<P>;

  isAbsent(): this is Absent<P>;

  isLost(): this is Lost<P>;

  ifPresent(consumer: Consumer<P>): void;

  ifAbsent(consumer: Consumer<void>): void;

  ifLost(consumer: Consumer<unknown>): void;
}
