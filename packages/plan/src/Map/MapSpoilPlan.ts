import { MapPlan } from './MapPlan';

export class MapSpoilPlan<in out M> implements MapPlan<M> {
  private static readonly INSTANCE: MapSpoilPlan<unknown> = new MapSpoilPlan();

  public static of<M>(): MapSpoilPlan<M> {
    return MapSpoilPlan.INSTANCE as MapSpoilPlan<M>;
  }

  protected constructor() {
    // NOOP
  }

  public onMap(): void {
    // NOOP
  }
}
