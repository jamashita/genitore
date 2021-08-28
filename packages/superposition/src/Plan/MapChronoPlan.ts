import { MapPlan } from '@jamashita/genitore-plan';
import { Detoxicated } from '@jamashita/genitore-schrodinger';
import { Chrono } from '../Chrono';

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
