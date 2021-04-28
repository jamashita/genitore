import { MapPlan } from '../../Plan/Interface/MapPlan';
import { Chrono } from '../Chrono/Interface/Chrono';
import { Detoxicated } from '../Interface/Detoxicated';

export class MapChronoPlan<A, D extends Error> implements MapPlan<Detoxicated<A>, 'MapChronoPlan'> {
  public readonly noun: 'MapChronoPlan' = 'MapChronoPlan';
  private readonly chrono: Chrono<A, D>;

  public static of<AT, DT extends Error>(chrono: Chrono<AT, DT>): MapChronoPlan<AT, DT> {
    return new MapChronoPlan<AT, DT>(chrono);
  }

  protected constructor(chrono: Chrono<A, D>) {
    this.chrono = chrono;
  }

  public onMap(value: Detoxicated<A>): unknown {
    return this.chrono.accept(value);
  }
}
