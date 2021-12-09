import { MapPlan } from './MapPlan';

export class MapSpoilPlan<M> implements MapPlan<M> {
  private static readonly INSTANCE: MapSpoilPlan<unknown> = new MapSpoilPlan<unknown>();

  public static of<M>(): MapSpoilPlan<M> {
    return MapSpoilPlan.INSTANCE;
  }

  protected constructor() {
    // NOOP
  }

  public onMap(): void {
    // NOOP
  }
}
