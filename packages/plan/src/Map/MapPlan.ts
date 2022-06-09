export interface MapPlan<in out M> {
  onMap(value: M): unknown;
}
