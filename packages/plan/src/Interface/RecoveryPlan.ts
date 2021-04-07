import { Noun } from '@jamashita/anden-type';

export interface RecoveryPlan<R, N extends string = string> extends Noun<N> {
  onRecover(value: R): unknown;
}
