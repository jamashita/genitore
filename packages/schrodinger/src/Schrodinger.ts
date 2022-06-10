import { Consumer, Serializable } from '@jamashita/anden-type';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';

export type SchrodingerState = 'ALIVE' | 'CONTRADICTION' | 'DEAD' | 'STILL';

export interface Schrodinger<out A, out D extends Error> extends Serializable {
  get(): Exclude<A, Error>;

  getState(): SchrodingerState;

  ifAlive(consumer: Consumer<Exclude<A, Error>>): void;

  ifContradiction(consumer: Consumer<unknown>): void;

  ifDead(consumer: Consumer<D>): void;

  isAlive(): this is Alive<A, D>;

  isContradiction(): this is Contradiction<A, D>;

  isDead(): this is Dead<A, D>;
}
