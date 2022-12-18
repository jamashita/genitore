import { Consumer } from '@jamashita/anden-type';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import { Chrono } from '../Chrono';

export class MockChrono<in out M, in out R extends Error> implements Chrono<M, R> {
  private readonly map: Consumer<Exclude<M, Error>>;
  private readonly recover: Consumer<R>;
  private readonly destroy: Consumer<unknown>;
  private readonly errors: Set<DeadConstructor<R>>;

  public constructor(map: Consumer<Exclude<M, Error>>, recover: Consumer<R>, destroy: Consumer<unknown>, errors: Set<DeadConstructor<R>>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
    this.errors = errors;
  }

  public accept(value: Exclude<M, Error>): unknown {
    return this.map(value);
  }

  public catch(errors: Iterable<DeadConstructor<R>>): void {
    [...errors].forEach((error: DeadConstructor<R>) => {
      this.errors.add(error);
    });
  }

  public decline(value: R): unknown {
    return this.recover(value);
  }

  public getErrors(): Set<DeadConstructor<R>> {
    return this.errors;
  }

  public throw(cause: unknown): unknown {
    return this.destroy(cause);
  }
}
