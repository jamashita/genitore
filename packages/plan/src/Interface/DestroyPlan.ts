import { Noun } from '@jamashita/publikum-interface';

export interface DestroyPlan<N extends string = string> extends Noun<N> {
  onDestroy(cause: unknown): unknown;
}
