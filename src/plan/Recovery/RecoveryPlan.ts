export interface RecoveryPlan<out R> {
  onRecover(value: R): unknown;
}
