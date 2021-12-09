import { DestroyPlan, MapPlan, Plan, RecoveryPlan } from '@jamashita/genitore-plan';
import { Detoxicated } from '@jamashita/genitore-schrodinger';

export class CombinedChronoPlan<A, D extends Error> implements Plan<Detoxicated<A>, D> {
  private readonly map: MapPlan<Detoxicated<A>>;
  private readonly recover: RecoveryPlan<D>;
  private readonly destroy: DestroyPlan;

  public static of<A, D extends Error>(map: MapPlan<Detoxicated<A>>, recover: RecoveryPlan<D>, destroy: DestroyPlan): CombinedChronoPlan<A, D> {
    return new CombinedChronoPlan<A, D>(map, recover, destroy);
  }

  protected constructor(map: MapPlan<Detoxicated<A>>, recover: RecoveryPlan<D>, destroy: DestroyPlan) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public onDestroy(cause: unknown): unknown {
    return this.destroy.onDestroy(cause);
  }

  public onMap(value: Detoxicated<A>): unknown {
    return this.map.onMap(value);
  }

  public onRecover(value: D): unknown {
    return this.recover.onRecover(value);
  }
}
