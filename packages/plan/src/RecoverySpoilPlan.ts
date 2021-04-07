import { RecoveryPlan } from './Interface/RecoveryPlan';

export class RecoverySpoilPlan<R> implements RecoveryPlan<R, 'RecoverySpoilPlan'> {
  public readonly noun: 'RecoverySpoilPlan' = 'RecoverySpoilPlan';

  private static readonly INSTANCE: RecoverySpoilPlan<unknown> = new RecoverySpoilPlan<unknown>();

  public static of<RT>(): RecoverySpoilPlan<RT> {
    return RecoverySpoilPlan.INSTANCE;
  }

  protected constructor() {
    // NOOP
  }

  public onRecover(value: R): unknown {
    return value;
  }
}
