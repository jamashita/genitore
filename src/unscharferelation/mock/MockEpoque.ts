import { Consumer } from '@jamashita/anden/type';
import { Epoque } from '../Epoque.js';

export class MockEpoque<in out M> implements Epoque<M> {
  private readonly map: Consumer<Exclude<M, null | undefined | void>>;
  private readonly recover: Consumer<void>;
  private readonly destroy: Consumer<unknown>;

  public constructor(map: Consumer<Exclude<M, null | undefined | void>>, recover: Consumer<void>, destroy: Consumer<unknown>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public accept(value: Exclude<M, null | undefined | void>): unknown {
    return this.map(value);
  }

  public decline(): unknown {
    return this.recover();
  }

  public throw(cause: unknown): unknown {
    return this.destroy(cause);
  }
}
