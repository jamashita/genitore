import { Noun } from '@jamashita/anden-type';
import { Matter } from '@jamashita/genitore-heisenberg';

export interface Epoque<M, N extends string = string> extends Noun<N> {
  accept(value: Matter<M>): unknown;

  decline(): unknown;

  throw(cause: unknown): unknown;
}
