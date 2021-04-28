import { Consumer, Whatever } from '@jamashita/anden-type';
import { Plan } from './Interface/Plan';

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

  public onMap(value: M): Whatever {
    return this.map(value);
  }

  public onRecover(value: R): Whatever {
    return this.recover(value);
  }

  public onDestroy(cause: unknown): Whatever {
    return this.destroy(cause);
  }
}
