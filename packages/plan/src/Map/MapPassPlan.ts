import { Consumer } from '@jamashita/anden-type';
import { MapPlan } from './MapPlan';

export class MapPassPlan<in out M> implements MapPlan<M> {
  private readonly map: Consumer<M>;

  public static of<M>(map: Consumer<M>): MapPassPlan<M> {
    return new MapPassPlan(map);
  }

  protected constructor(map: Consumer<M>) {
    this.map = map;
  }

  public onMap(value: M): unknown {
    return this.map(value);
  }
}
