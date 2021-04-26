import { Consumer, Noun, Serializable } from '@jamashita/anden-type';
import { Detoxicated } from '../Interface/Detoxicated';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { SchrodingerType } from './SchrodingerType';

export interface Schrodinger<A, D extends Error, N extends SchrodingerType = SchrodingerType> extends Serializable, Noun<N> {
  get(): Detoxicated<A>;

  status(): SchrodingerType;

  isAlive(): this is Alive<A, D>;

  isDead(): this is Dead<A, D>;

  isContradiction(): this is Contradiction<A, D>;

  ifAlive(consumer: Consumer<A>): void;

  ifDead(consumer: Consumer<D>): void;

  ifContradiction(consumer: Consumer<unknown>): void;
}
