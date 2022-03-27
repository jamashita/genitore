import { RecoveryPlan } from './RecoveryPlan';

export class RecoverySpoilPlan<R> implements RecoveryPlan<R> {
  private static readonly INSTANCE: RecoverySpoilPlan<unknown> = new RecoverySpoilPlan<unknown>();

  public static of<R>(): RecoverySpoilPlan<R> {
    return RecoverySpoilPlan.INSTANCE as RecoverySpoilPlan<R>;
  }

  protected constructor() {
    // NOOP
  }

  public onRecover(): void {
    // NOOP
  }
}
