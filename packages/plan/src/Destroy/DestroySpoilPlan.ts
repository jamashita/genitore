import { DestroyPlan } from './DestroyPlan';

export class DestroySpoilPlan implements DestroyPlan {

  private static readonly INSTANCE: DestroySpoilPlan = new DestroySpoilPlan();

  public static of(): DestroySpoilPlan {
    return DestroySpoilPlan.INSTANCE;
  }

  protected constructor() {
    // NOOP
  }

  public onDestroy(): void {
    // NOOP
  }
}
