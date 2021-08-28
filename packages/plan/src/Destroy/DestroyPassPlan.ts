import { Consumer } from '@jamashita/anden-type';
import { DestroyPlan } from './DestroyPlan';

export class DestroyPassPlan implements DestroyPlan<'DestroyPassPlan'> {
  public readonly noun: 'DestroyPassPlan' = 'DestroyPassPlan';
  private readonly destroy: Consumer<unknown>;

  public static of(destroy: Consumer<unknown>): DestroyPassPlan {
    return new DestroyPassPlan(destroy);
  }

  protected constructor(destroy: Consumer<unknown>) {
    this.destroy = destroy;
  }

  public onDestroy(cause: unknown): unknown {
    return this.destroy(cause);
  }
}
