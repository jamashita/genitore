import {
  Consumer,
  Kind,
  Noun,
  Peek,
  Serializable,
  Supplier,
  Suspicious,
  SyncAsync,
  UnaryFunction
} from '@jamashita/anden-type';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { Matter } from './Matter';

export type UReturnType<Q> = SyncAsync<IUnscharferelation<Q> | Suspicious<Matter<Q>>>;

export interface IUnscharferelation<P, N extends string = string> extends Serializable, Noun<N> {
  get(): Promise<Matter<P>>;

  terminate(): Promise<Heisenberg<P>>;

  map<Q = P>(mapper: UnaryFunction<Matter<P>, UReturnType<Q>>): IUnscharferelation<Q>;

  recover<Q = P>(mapper: Supplier<UReturnType<Q>>): IUnscharferelation<P | Q>;

  ifPresent(consumer: Consumer<Matter<P>>): this;

  ifAbsent(consumer: Consumer<void>): this;

  ifLost(consumer: Consumer<unknown>): this;

  pass(accepted: Consumer<Matter<P>>, declined: Consumer<void>, thrown: Consumer<unknown>): this;

  peek(peek: Peek): this;
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

  return true;
};
