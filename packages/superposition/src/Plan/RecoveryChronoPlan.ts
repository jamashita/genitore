import { RecoveryPlan } from '@jamashita/genitore-plan';
import { Chrono } from '../Chrono';

export class RecoveryChronoPlan<A, D extends Error> implements RecoveryPlan<D, 'RecoveryChronoPlan'> {
  public readonly noun: 'RecoveryChronoPlan' = 'RecoveryChronoPlan';
  private readonly chrono: Chrono<A, D>;

  public static of<AT, DT extends Error>(chrono: Chrono<AT, DT>): RecoveryChronoPlan<AT, DT> {
    return new RecoveryChronoPlan<AT, DT>(chrono);
  }

  protected constructor(chrono: Chrono<A, D>) {
    this.chrono = chrono;
  }

  public onRecover(value: D): unknown {
    return this.chrono.decline(value);
  }
}
