import { Matter } from '@jamashita/genitore-heisenberg';

export interface Epoque<M> {
  accept(value: Matter<M>): unknown;

  decline(): unknown;

  throw(cause: unknown): unknown;
}
