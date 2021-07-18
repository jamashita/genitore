import { Consumer, Whatever } from '@jamashita/anden-type';
import { MapPlan } from './MapPlan.js';

export class MapPassPlan<M> implements MapPlan<M, 'MapPassPlan'> {
  public readonly noun: 'MapPassPlan' = 'MapPassPlan';
  private readonly map: Consumer<M>;

  public static of<MT>(map: Consumer<MT>): MapPassPlan<MT> {
    return new MapPassPlan<MT>(map);
  }

  protected constructor(map: Consumer<M>) {
    this.map = map;
  }

  public onMap(value: M): Whatever {
    return this.map(value);
  }
}
