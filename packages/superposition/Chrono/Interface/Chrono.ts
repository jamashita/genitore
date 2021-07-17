import { Noun } from '@jamashita/anden-type';
import { DeadConstructor } from '../../Interface/DeadConstructor.js';
import { Detoxicated } from '../../Interface/Detoxicated.js';

export interface Chrono<M, R extends Error, N extends string = string> extends Noun<N> {
  accept(value: Detoxicated<M>): unknown;

  catch(errors: Iterable<DeadConstructor<R>>): void;

  decline(value: R): unknown;

  getErrors(): Set<DeadConstructor<R>>;

  throw(cause: unknown): unknown;
}
