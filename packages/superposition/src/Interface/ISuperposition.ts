import { Consumer, Kind, Noun, Peek, Serializable, UnaryFunction } from '@jamashita/anden-type';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { Bdb } from './Bdb';
import { DeadConstructor } from './DeadConstructor';
import { Detoxicated } from './Detoxicated';

export interface ISuperposition<A, D extends Error, N extends string = string> extends Serializable, Noun<N> {
  get(): Promise<Detoxicated<A>>;

  getErrors(): Set<DeadConstructor<D>>;

  terminate(): Promise<Schrodinger<A, D>>;

  map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, PromiseLike<ISuperposition<B, E>> | ISuperposition<B, E> | PromiseLike<Bdb<B>> | Bdb<B>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): ISuperposition<B, D | E>;

  recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, PromiseLike<ISuperposition<B, E>> | ISuperposition<B, E> | PromiseLike<Bdb<B>> | Bdb<B>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): ISuperposition<A | B, E>;

  transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, PromiseLike<ISuperposition<B, E>> | ISuperposition<B, E> | PromiseLike<Bdb<B>> | Bdb<B>>,
    dead: UnaryFunction<D, PromiseLike<ISuperposition<B, E>> | ISuperposition<B, E> | PromiseLike<Bdb<B>> | Bdb<B>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): ISuperposition<B, E>;

  ifAlive(consumer: Consumer<Detoxicated<A>>): this;

  ifDead(consumer: Consumer<D>): this;

  ifContradiction(consumer: Consumer<unknown>): this;

  pass(accepted: Consumer<Detoxicated<A>>, declined: Consumer<D>, thrown: Consumer<unknown>): this;

  peek(peek: Peek): this;
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
