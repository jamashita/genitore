import { MapPlan } from '@jamashita/genitore-plan';
import { Chrono } from '../Chrono';

export class MapChronoPlan<out A, out D extends Error> implements MapPlan<Exclude<A, Error>> {
  private readonly chrono: Chrono<A, D>;

  public static of<A, D extends Error>(chrono: Chrono<A, D>): MapChronoPlan<A, D> {
    return new MapChronoPlan(chrono);
  }

  protected constructor(chrono: Chrono<A, D>) {
    this.chrono = chrono;
  }

  public onMap(value: Exclude<A, Error>): unknown {
    return this.chrono.accept(value);
  }
}
