import type { Consumer } from '@jamashita/anden/type';
import type { RecoveryPlan } from './RecoveryPlan.js';

export class RecoveryPassPlan<in out R> implements RecoveryPlan<R> {
  private readonly recover: Consumer<R>;

  public static of<R>(recover: Consumer<R>): RecoveryPassPlan<R> {
    return new RecoveryPassPlan(recover);
  }

  protected constructor(recover: Consumer<R>) {
    this.recover = recover;
  }

  public onRecover(value: R): unknown {
    return this.recover(value);
  }
}
