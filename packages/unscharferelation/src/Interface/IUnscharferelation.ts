import { Consumer, Kind, Noun, Peek, Serializable, Supplier, UnaryFunction } from '@jamashita/anden-type';
import { ISuperposition } from '@jamashita/genitore-superposition';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { Ymy } from './Ymy';
import { Matter } from './Matter';

export interface IUnscharferelation<P, N extends string = string> extends Serializable, Noun<N> {
  get(): Promise<Matter<P>>;

  terminate(): Promise<Heisenberg<P>>;

  map<Q = P>(mapper: UnaryFunction<Matter<P>, IUnscharferelation<Q> | PromiseLike<IUnscharferelation<Q>> | PromiseLike<Ymy<Q>> | Ymy<Q>>): IUnscharferelation<Q>;

  recover<Q = P>(mapper: Supplier<IUnscharferelation<Q> | PromiseLike<IUnscharferelation<Q>> | PromiseLike<Ymy<Q>> | Ymy<Q>>): IUnscharferelation<P | Q>;

  ifPresent(consumer: Consumer<Matter<P>>): this;

  ifAbsent(consumer: Consumer<void>): this;

  ifLost(consumer: Consumer<unknown>): this;

  pass(accepted: Consumer<Matter<P>>, declined: Consumer<void>, thrown: Consumer<unknown>): this;

  peek(peek: Peek): this;

  toSuperposition(): ISuperposition<P, UnscharferelationError>;
}

export const isUnscharferelation = <P>(value: unknown): value is IUnscharferelation<P> => {
  if (!Kind.isObject<IUnscharferelation<P>>(value)) {
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
  if (!Kind.isFunction(value.ifPresent)) {
    return false;
  }
  if (!Kind.isFunction(value.ifAbsent)) {
    return false;
  }
  if (!Kind.isFunction(value.ifLost)) {
    return false;
  }
  if (!Kind.isFunction(value.pass)) {
    return false;
  }
  if (!Kind.isFunction(value.peek)) {
    return false;
  }
  if (!Kind.isFunction(value.toSuperposition)) {
    return false;
  }

  return true;
};
