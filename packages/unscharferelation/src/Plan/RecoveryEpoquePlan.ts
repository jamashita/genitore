import { RecoveryPlan } from '@jamashita/genitore-plan';
import { Epoque } from '../Epoque';

export class RecoveryEpoquePlan<P> implements RecoveryPlan<void> {
  private readonly epoque: Epoque<P>;

  public static of<P>(epoque: Epoque<P>): RecoveryEpoquePlan<P> {
    return new RecoveryEpoquePlan<P>(epoque);
  }

  protected constructor(epoque: Epoque<P>) {
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    return this.epoque.decline();
  }
}
