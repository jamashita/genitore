import type { Consumer } from '@jamashita/anden/type';
import type { Chrono } from '../Chrono.js';

export class MockChrono<in out M, in out R extends Error> implements Chrono<M, R> {
  private readonly map: Consumer<Exclude<M, Error>>;
  private readonly recover: Consumer<R>;
  private readonly destroy: Consumer<unknown>;

  public constructor(map: Consumer<Exclude<M, Error>>, recover: Consumer<R>, destroy: Consumer<unknown>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public accept(value: Exclude<M, Error>): unknown {
    return this.map(value);
  }

  public decline(value: R): unknown {
    return this.recover(value);
  }

  public throw(cause: unknown): unknown {
    return this.destroy(cause);
  }
}
