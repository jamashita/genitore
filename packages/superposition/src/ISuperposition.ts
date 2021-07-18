import { Consumer, Kind, Noun, Peek, Serializable, SyncAsync, UnaryFunction } from '@jamashita/anden-type';
import { DeadConstructor, Detoxicated } from '@jamashita/genitore-schrodinger';
import { Schrodinger } from '../../schrodinger/src/Schrodinger.js';

export type SReturnType<B, E extends Error> = SyncAsync<Detoxicated<B> | ISuperposition<B, E>>;

export interface ISuperposition<A, D extends Error, N extends string = string> extends Serializable, Noun<N> {
  get(): Promise<Detoxicated<A>>;

  getErrors(): Set<DeadConstructor<D>>;

  ifAlive(consumer: Consumer<Detoxicated<A>>): this;

  ifContradiction(consumer: Consumer<unknown>): this;

  ifDead(consumer: Consumer<D>): this;

  map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): ISuperposition<B, D | E>;

  pass(accepted: Consumer<Detoxicated<A>>, declined: Consumer<D>, thrown: Consumer<unknown>): this;

  peek(peek: Peek): this;

  recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): ISuperposition<A | B, E>;

  terminate(): Promise<Schrodinger<A, D>>;

  transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, SReturnType<B, E>>,
    dead: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): ISuperposition<B, E>;
}

export const isSuperposition = <A, D extends Error>(value: unknown): value is ISuperposition<A, D> => {
  if (!Kind.isObject<ISuperposition<A, D>>(value)) {
    return false;
  }
  if (!Kind.isFunction(value.get)) {
    return false;
  }
  if (!Kind.isFunction(value.getErrors)) {
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

export const containsError = <E extends Error>(err: unknown, errors: Set<DeadConstructor<E>>): err is E => {
  return [...errors].some((error: DeadConstructor<E>) => {
    return Kind.isClass<DeadConstructor<E>>(err, error);
  });
};
