import { RecoveryPlan } from '../../plan/index.js';
import { Epoque } from '../Epoque.js';

export class RecoveryEpoquePlan<out P> implements RecoveryPlan<void> {
  private readonly epoque: Epoque<P>;

  public static of<P>(epoque: Epoque<P>): RecoveryEpoquePlan<P> {
    return new RecoveryEpoquePlan(epoque);
  }

  protected constructor(epoque: Epoque<P>) {
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    return this.epoque.decline();
  }
}
