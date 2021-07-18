import { Noun, Whatever } from '@jamashita/anden-type';

export interface MapPlan<M, N extends string = string> extends Noun<N> {
  onMap(value: M): Whatever;
}
