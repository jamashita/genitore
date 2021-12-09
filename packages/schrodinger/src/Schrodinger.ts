import { Consumer, Serializable } from '@jamashita/anden-type';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Detoxicated } from './Detoxicated';

export interface Schrodinger<A, D extends Error> extends Serializable {
  get(): Detoxicated<A>;

  ifAlive(consumer: Consumer<A>): void;

  ifContradiction(consumer: Consumer<unknown>): void;

  ifDead(consumer: Consumer<D>): void;

  isAlive(): this is Alive<A, D>;

  isContradiction(): this is Contradiction<A, D>;

  isDead(): this is Dead<A, D>;
}
