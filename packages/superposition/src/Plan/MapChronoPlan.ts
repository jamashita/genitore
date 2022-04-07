import { MapPlan } from '@jamashita/genitore-plan';
import { Detoxicated } from '@jamashita/genitore-schrodinger';
import { Chrono } from '../Chrono';

export class MapChronoPlan<A, D extends Error> implements MapPlan<Detoxicated<A>> {
  private readonly chrono: Chrono<A, D>;

  public static of<A, D extends Error>(chrono: Chrono<A, D>): MapChronoPlan<A, D> {
    return new MapChronoPlan(chrono);
  }

  protected constructor(chrono: Chrono<A, D>) {
    this.chrono = chrono;
  }

  public onMap(value: Detoxicated<A>): unknown {
    return this.chrono.accept(value);
  }
}
