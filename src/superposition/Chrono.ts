import { DeadConstructor } from '../schrodinger/index.js';

export interface Chrono<out M, out R extends Error> {
  accept(value: Exclude<M, Error>): unknown;

  catch(errors: Iterable<DeadConstructor<R>>): void;

  decline(value: R): unknown;

  getErrors(): Set<DeadConstructor<R>>;

  throw(cause: unknown): unknown;
}
