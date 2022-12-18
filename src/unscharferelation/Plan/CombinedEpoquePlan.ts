import { DestroyPlan, MapPlan, Plan, RecoveryPlan } from '../../plan/index.js';

export class CombinedEpoquePlan<out P> implements Plan<Exclude<P, null | undefined | void>, void> {
  private readonly map: MapPlan<Exclude<P, null | undefined | void>>;
  private readonly recover: RecoveryPlan<void>;
  private readonly destroy: DestroyPlan;

  public static of<P>(map: MapPlan<Exclude<P, null | undefined | void>>, recover: RecoveryPlan<void>, destroy: DestroyPlan): CombinedEpoquePlan<P> {
    return new CombinedEpoquePlan(map, recover, destroy);
  }

  protected constructor(map: MapPlan<Exclude<P, null | undefined | void>>, recover: RecoveryPlan<void>, destroy: DestroyPlan) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public onDestroy(cause: unknown): unknown {
    return this.destroy.onDestroy(cause);
  }

  public onMap(value: Exclude<P, null | undefined | void>): unknown {
    return this.map.onMap(value);
  }

  public onRecover(): unknown {
    return this.recover.onRecover();
  }
}
