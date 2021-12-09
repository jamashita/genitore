import { DeadConstructor, Detoxicated } from '@jamashita/genitore-schrodinger';

export interface Chrono<M, R extends Error> {
  accept(value: Detoxicated<M>): unknown;

  catch(errors: Iterable<DeadConstructor<R>>): void;

  decline(value: R): unknown;

  getErrors(): Set<DeadConstructor<R>>;

  throw(cause: unknown): unknown;
}
