import type { DestroyPlan, MapPlan, Plan, RecoveryPlan } from '../../plan/index.js';

// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
export class CombinedEpoquePlan<out P> implements Plan<Exclude<P, null | undefined | void>, void> {
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  private readonly map: MapPlan<Exclude<P, null | undefined | void>>;
  private readonly recover: RecoveryPlan<void>;
  private readonly destroy: DestroyPlan;

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public static of<P>(map: MapPlan<Exclude<P, null | undefined | void>>, recover: RecoveryPlan<void>, destroy: DestroyPlan): CombinedEpoquePlan<P> {
    return new CombinedEpoquePlan(map, recover, destroy);
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  protected constructor(map: MapPlan<Exclude<P, null | undefined | void>>, recover: RecoveryPlan<void>, destroy: DestroyPlan) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public onDestroy(cause: unknown): unknown {
    return this.destroy.onDestroy(cause);
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public onMap(value: Exclude<P, null | undefined | void>): unknown {
    return this.map.onMap(value);
  }

  public onRecover(): unknown {
    return this.recover.onRecover();
  }
}
