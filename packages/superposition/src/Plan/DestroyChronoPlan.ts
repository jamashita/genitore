import { DestroyPlan } from '@jamashita/genitore-plan';
import { Chrono } from '../Chrono';

export class DestroyChronoPlan<A, D extends Error> implements DestroyPlan {
  private readonly chrono: Chrono<A, D>;

  public static of<A, D extends Error>(chrono: Chrono<A, D>): DestroyChronoPlan<A, D> {
    return new DestroyChronoPlan(chrono);
  }

  protected constructor(chrono: Chrono<A, D>) {
    this.chrono = chrono;
  }

  public onDestroy(cause: unknown): unknown {
    return this.chrono.throw(cause);
  }
}
