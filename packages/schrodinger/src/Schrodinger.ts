import { Consumer, Noun, Serializable } from '@jamashita/anden-type';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Detoxicated } from './Detoxicated';
import { SchrodingerType } from './SchrodingerType';

export interface Schrodinger<A, D extends Error, N extends SchrodingerType = SchrodingerType> extends Serializable, Noun<N> {
  get(): Detoxicated<A>;

  ifAlive(consumer: Consumer<A>): void;

  ifContradiction(consumer: Consumer<unknown>): void;

  ifDead(consumer: Consumer<D>): void;

  isAlive(): this is Alive<A, D>;

  isContradiction(): this is Contradiction<A, D>;

  isDead(): this is Dead<A, D>;
}
