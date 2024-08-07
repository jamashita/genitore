import { type Consumer, Kind, type Peek, type Serializable, type UnaryFunction } from '@jamashita/anden/type';
import type { Schrodinger } from '../schrodinger/index.js';

export type SReturnType<B, E> = B | ISuperposition<B, E> | PromiseLike<B> | PromiseLike<ISuperposition<B, E>>;

export interface ISuperposition<out A, out D> extends Serializable {
  get(): Promise<A>;

  ifAlive(consumer: Consumer<A>): this;

  ifContradiction(consumer: Consumer<unknown>): this;

  ifDead(consumer: Consumer<D>): this;

  map<B = A, E = D>(mapper: UnaryFunction<A, SReturnType<B, E>>): ISuperposition<B, D | E>;

  pass(accepted: Consumer<A>, declined: Consumer<D>, thrown: Consumer<unknown>): this;

  peek(peek: Peek): this;

  recover<B = A, E = D>(mapper: UnaryFunction<D, SReturnType<B, E>>): ISuperposition<A | B, E>;

  terminate(): Promise<Schrodinger<A, D>>;

  transform<B = A, E = D>(alive: UnaryFunction<A, SReturnType<B, E>>, dead: UnaryFunction<D, SReturnType<B, E>>): ISuperposition<B, E>;
}

export const isSuperposition = <A, D>(value: unknown): value is ISuperposition<A, D> => {
  if (!Kind.isObject<ISuperposition<A, D>>(value)) {
    return false;
  }
  if (!Kind.isFunction(value.get)) {
    return false;
  }
  if (!Kind.isFunction(value.terminate)) {
    return false;
  }
  if (!Kind.isFunction(value.map)) {
    return false;
  }
  if (!Kind.isFunction(value.recover)) {
    return false;
  }
  if (!Kind.isFunction(value.transform)) {
    return false;
  }
  if (!Kind.isFunction(value.ifAlive)) {
    return false;
  }
  if (!Kind.isFunction(value.ifDead)) {
    return false;
  }
  if (!Kind.isFunction(value.ifContradiction)) {
    return false;
  }
  if (!Kind.isFunction(value.pass)) {
    return false;
  }
  if (!Kind.isFunction(value.peek)) {
    return false;
  }

  return true;
};
