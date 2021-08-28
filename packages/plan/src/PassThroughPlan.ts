import { Consumer } from '@jamashita/anden-type';
import { Plan } from './Plan';

export class PassThroughPlan<M, R> implements Plan<M, R, 'PassThroughPlan'> {
  public readonly noun: 'PassThroughPlan' = 'PassThroughPlan';
  private readonly map: Consumer<M>;
  private readonly recover: Consumer<R>;
  private readonly destroy: Consumer<unknown>;

  public static of<MT, RT>(map: Consumer<MT>, recover: Consumer<RT>, destroy: Consumer<unknown>): PassThroughPlan<MT, RT> {
    return new PassThroughPlan<MT, RT>(map, recover, destroy);
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
