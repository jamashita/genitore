import type { MapPlan } from '../../plan/index.js';
import type { Chrono } from '../Chrono.js';

export class MapChronoPlan<out A, out D> implements MapPlan<A> {
  private readonly chrono: Chrono<A, D>;

  public static of<A, D>(chrono: Chrono<A, D>): MapChronoPlan<A, D> {
    return new MapChronoPlan(chrono);
  }

  protected constructor(chrono: Chrono<A, D>) {
    this.chrono = chrono;
  }

  public onMap(value: A): unknown {
    return this.chrono.accept(value);
  }
}
