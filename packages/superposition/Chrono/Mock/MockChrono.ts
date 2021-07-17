import { Consumer } from '@jamashita/anden-type';
import { DeadConstructor } from '../../Interface/DeadConstructor.js';
import { Detoxicated } from '../../Interface/Detoxicated.js';
import { Chrono } from '../Interface/Chrono.js';

export class MockChrono<M, R extends Error> implements Chrono<M, R, 'MockChrono'> {
  public readonly noun: 'MockChrono' = 'MockChrono';
  private readonly map: Consumer<Detoxicated<M>>;
  private readonly recover: Consumer<R>;
  private readonly destroy: Consumer<unknown>;
  private readonly errors: Set<DeadConstructor<R>>;

  public constructor(map: Consumer<Detoxicated<M>>, recover: Consumer<R>, destroy: Consumer<unknown>, errors: Set<DeadConstructor<R>>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
    this.errors = errors;
  }

  public accept(value: Detoxicated<M>): unknown {
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
