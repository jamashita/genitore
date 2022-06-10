export interface MapPlan<out M> {
  onMap(value: M): unknown;
}
