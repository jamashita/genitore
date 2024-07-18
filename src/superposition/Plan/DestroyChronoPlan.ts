import type { DestroyPlan } from '../../plan/index.js';
import type { Chrono } from '../Chrono.js';

export class DestroyChronoPlan<out A, out D> implements DestroyPlan {
  private readonly chrono: Chrono<A, D>;

  public static of<A, D>(chrono: Chrono<A, D>): DestroyChronoPlan<A, D> {
    return new DestroyChronoPlan(chrono);
  }

  protected constructor(chrono: Chrono<A, D>) {
    this.chrono = chrono;
  }

  public onDestroy(cause: unknown): unknown {
    return this.chrono.throw(cause);
  }
}
