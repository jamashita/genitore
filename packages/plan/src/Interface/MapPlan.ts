import { Noun } from '@jamashita/publikum-interface';

export interface MapPlan<M, N extends string = string> extends Noun<N> {
  onMap(value: M): unknown;
}
