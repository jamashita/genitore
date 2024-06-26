import type { Consumer } from '@jamashita/anden/type';
import type { DestroyPlan } from './DestroyPlan.js';

export class DestroyPassPlan implements DestroyPlan {
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
