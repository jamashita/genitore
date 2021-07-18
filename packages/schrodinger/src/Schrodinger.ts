import { Consumer, Noun, Serializable } from '@jamashita/anden-type';
import { Alive } from './Alive.js';
import { Contradiction } from './Contradiction.js';
import { Dead } from './Dead.js';
import { Detoxicated } from './Detoxicated.js';
import { SchrodingerType } from './SchrodingerType.js';

export interface Schrodinger<A, D extends Error, N extends SchrodingerType = SchrodingerType> extends Serializable, Noun<N> {
  get(): Detoxicated<A>;

  ifAlive(consumer: Consumer<A>): void;

  ifContradiction(consumer: Consumer<unknown>): void;

  ifDead(consumer: Consumer<D>): void;

  isAlive(): this is Alive<A, D>;

  isContradiction(): this is Contradiction<A, D>;

  isDead(): this is Dead<A, D>;
}
