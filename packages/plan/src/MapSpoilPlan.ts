import { Whatever } from '@jamashita/anden-type';
import { MapPlan } from './Interface/MapPlan';

export class MapSpoilPlan<M> implements MapPlan<M, 'MapSpoilPlan'> {
  public readonly noun: 'MapSpoilPlan' = 'MapSpoilPlan';

  private static readonly INSTANCE: MapSpoilPlan<unknown> = new MapSpoilPlan<unknown>();

  public static of<MT>(): MapSpoilPlan<MT> {
    return MapSpoilPlan.INSTANCE;
  }

  protected constructor() {
    // NOOP
  }

  public onMap(): Whatever {
    return;
  }
}
