export interface RecoveryPlan<in out R> {
  onRecover(value: R): unknown;
}
