import { Noun, Whatever } from '@jamashita/anden-type';

export interface RecoveryPlan<R, N extends string = string> extends Noun<N> {
  onRecover(value: R): Whatever;
}
