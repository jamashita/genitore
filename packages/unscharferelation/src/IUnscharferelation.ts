import { Consumer, Kind, Peek, Serializable, Supplier, UnaryFunction } from '@jamashita/anden-type';
import { Heisenberg } from '@jamashita/genitore-heisenberg';

export type UReturnType<T> =
  IUnscharferelation<T>
  | PromiseLike<IUnscharferelation<T>>
  | PromiseLike<null | undefined | void>
  | PromiseLike<T>
  | T
  | null
  | undefined
  | void;

export interface IUnscharferelation<out P> extends Serializable {
  get(): Promise<Exclude<P, null | undefined | void>>;

  ifAbsent(consumer: Consumer<void>): this;

  ifLost(consumer: Consumer<unknown>): this;

  ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this;

  map<Q = P>(mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>): IUnscharferelation<Q>;

  pass(accepted: Consumer<Exclude<P, null | undefined | void>>, declined: Consumer<void>, thrown: Consumer<unknown>): this;

  peek(peek: Peek): this;

  recover<Q = P>(mapper: Supplier<UReturnType<Q>>): IUnscharferelation<P | Q>;

  terminate(): Promise<Heisenberg<P>>;
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
