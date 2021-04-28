import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { Epoque } from '../Epoque/Interface/Epoque';

export class RecoveryEpoquePlan<P> implements RecoveryPlan<'RecoveryEpoquePlan'> {
  public readonly noun: 'RecoveryEpoquePlan' = 'RecoveryEpoquePlan';
  private readonly epoque: Epoque<P>;

  public static of<PT>(epoque: Epoque<PT>): RecoveryEpoquePlan<PT> {
    return new RecoveryEpoquePlan<PT>(epoque);
  }

  protected constructor(epoque: Epoque<P>) {
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    return this.epoque.decline();
  }
}
