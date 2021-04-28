import { DestroyPlan } from '@jamashita/genitore-plan';
import { Chrono } from '../Chrono/Interface/Chrono';

export class DestroyChronoPlan<A, D extends Error> implements DestroyPlan<'DestroyChronoPlan'> {
  public readonly noun: 'DestroyChronoPlan' = 'DestroyChronoPlan';
  private readonly chrono: Chrono<A, D>;

  public static of<AT, DT extends Error>(chrono: Chrono<AT, DT>): DestroyChronoPlan<AT, DT> {
    return new DestroyChronoPlan<AT, DT>(chrono);
  }

  protected constructor(chrono: Chrono<A, D>) {
    this.chrono = chrono;
  }

  public onDestroy(cause: unknown): unknown {
    return this.chrono.throw(cause);
  }
}
