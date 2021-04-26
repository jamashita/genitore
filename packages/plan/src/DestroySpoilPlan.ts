import { DestroyPlan } from './Interface/DestroyPlan';

export class DestroySpoilPlan implements DestroyPlan<'DestroySpoilPlan'> {
  public readonly noun: 'DestroySpoilPlan' = 'DestroySpoilPlan';

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
