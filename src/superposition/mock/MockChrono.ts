import type { Consumer } from '@jamashita/anden/type';
import type { Chrono } from '../Chrono.js';

export class MockChrono<in out M, in out R> implements Chrono<M, R> {
  private readonly map: Consumer<M>;
  private readonly recover: Consumer<R>;
  private readonly destroy: Consumer<unknown>;

  public constructor(map: Consumer<M>, recover: Consumer<R>, destroy: Consumer<unknown>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public accept(value: M): unknown {
    return this.map(value);
  }

  public decline(value: R): unknown {
    return this.recover(value);
  }

  public throw(cause: unknown): unknown {
    return this.destroy(cause);
  }
}
