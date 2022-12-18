import { RecoveryPlan } from '../../plan/index.js';
import { Chrono } from '../Chrono.js';

export class RecoveryChronoPlan<out A, out D extends Error> implements RecoveryPlan<D> {
  private readonly chrono: Chrono<A, D>;

  public static of<A, D extends Error>(chrono: Chrono<A, D>): RecoveryChronoPlan<A, D> {
    return new RecoveryChronoPlan(chrono);
  }

  protected constructor(chrono: Chrono<A, D>) {
    this.chrono = chrono;
  }

  public onRecover(value: D): unknown {
    return this.chrono.decline(value);
  }
}
