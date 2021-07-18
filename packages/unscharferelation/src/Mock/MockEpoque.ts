import { Consumer } from '@jamashita/anden-type';
import { Matter } from '@jamashita/genitore-heisenberg';
import { Epoque } from '../Epoque.js';

export class MockEpoque<M> implements Epoque<M, 'MockEpoque'> {
  public readonly noun: 'MockEpoque' = 'MockEpoque';
  private readonly map: Consumer<Matter<M>>;
  private readonly recover: Consumer<void>;
  private readonly destroy: Consumer<unknown>;

  public constructor(map: Consumer<Matter<M>>, recover: Consumer<void>, destroy: Consumer<unknown>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public accept(value: Matter<M>): unknown {
    return this.map(value);
  }

  public decline(): unknown {
    return this.recover();
  }

  public throw(cause: unknown): unknown {
    return this.destroy(cause);
  }
}
