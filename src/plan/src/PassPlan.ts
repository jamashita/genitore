import { Consumer } from '@jamashita/anden-type';
import { Plan } from './Plan';

// FIXME do i need it?
export class PassPlan<in out M, in out R> implements Plan<M, R> {
  private readonly map: Consumer<M>;
  private readonly recover: Consumer<R>;
  private readonly destroy: Consumer<unknown>;

  public static of<M, R>(map: Consumer<M>, recover: Consumer<R>, destroy: Consumer<unknown>): PassPlan<M, R> {
    return new PassPlan(map, recover, destroy);
  }

  protected constructor(map: Consumer<M>, recover: Consumer<R>, destroy: Consumer<unknown>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public onDestroy(cause: unknown): unknown {
    return this.destroy(cause);
  }

  public onMap(value: M): unknown {
    return this.map(value);
  }

  public onRecover(value: R): unknown {
    return this.recover(value);
  }
}
