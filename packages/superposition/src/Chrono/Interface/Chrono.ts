import { Noun } from '@jamashita/publikum-interface';
import { DeadConstructor } from '../../Interface/DeadConstructor';
import { Detoxicated } from '../../Interface/Detoxicated';

export interface Chrono<M, R extends Error, N extends string = string> extends Noun<N> {
  accept(value: Detoxicated<M>): unknown;

  decline(value: R): unknown;

  throw(cause: unknown): unknown;

  getErrors(): Set<DeadConstructor<R>>;

  catch(errors: Iterable<DeadConstructor<R>>): void;
}
