import type { DestroyPlan, MapPlan, Plan, RecoveryPlan } from '../../plan/index.js';

export class CombinedChronoPlan<out A, out D extends Error> implements Plan<Exclude<A, Error>, D> {
  private readonly map: MapPlan<Exclude<A, Error>>;
  private readonly recover: RecoveryPlan<D>;
  private readonly destroy: DestroyPlan;

  public static of<A, D extends Error>(map: MapPlan<Exclude<A, Error>>, recover: RecoveryPlan<D>, destroy: DestroyPlan): CombinedChronoPlan<A, D> {
    return new CombinedChronoPlan(map, recover, destroy);
  }

  protected constructor(map: MapPlan<Exclude<A, Error>>, recover: RecoveryPlan<D>, destroy: DestroyPlan) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public onDestroy(cause: unknown): unknown {
    return this.destroy.onDestroy(cause);
  }

  public onMap(value: Exclude<A, Error>): unknown {
    return this.map.onMap(value);
  }

  public onRecover(value: D): unknown {
    return this.recover.onRecover(value);
  }
}
