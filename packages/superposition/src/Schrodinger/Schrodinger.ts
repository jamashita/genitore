import { Nominative } from '@jamashita/publikum-interface';
import { Consumer } from '@jamashita/publikum-type';
import { Detoxicated } from '../Interface/Detoxicated';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';

type SchrodingerType = 'Alive' | 'Contradiction' | 'Dead' | 'Still';

export interface Schrodinger<A, D extends Error, N extends SchrodingerType = SchrodingerType> extends Nominative<N> {
  get(): Detoxicated<A>;

  isAlive(): this is Alive<A, D>;

  isDead(): this is Dead<A, D>;

  isContradiction(): this is Contradiction<A, D>;

  ifAlive(consumer: Consumer<A>): void;

  ifDead(consumer: Consumer<D>): void;

  ifContradiction(consumer: Consumer<unknown>): void;
}
