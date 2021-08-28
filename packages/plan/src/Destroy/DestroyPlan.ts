import { Noun } from '@jamashita/anden-type';

export interface DestroyPlan<N extends string = string> extends Noun<N> {
  onDestroy(cause: unknown): unknown;
}