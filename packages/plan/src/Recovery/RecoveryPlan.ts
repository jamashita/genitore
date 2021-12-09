export interface RecoveryPlan<R> {
  onRecover(value: R): unknown;
}
