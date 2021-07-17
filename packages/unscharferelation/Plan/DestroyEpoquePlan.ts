import { DestroyPlan } from '../../plan/Interface/DestroyPlan.js';
import { Epoque } from '../Epoque/Interface/Epoque.js';

export class DestroyEpoquePlan<P> implements DestroyPlan<'DestroyEpoquePlan'> {
  public readonly noun: 'DestroyEpoquePlan' = 'DestroyEpoquePlan';
  private readonly epoque: Epoque<P>;

  public static of<PT>(epoque: Epoque<PT>): DestroyEpoquePlan<PT> {
    return new DestroyEpoquePlan<PT>(epoque);
  }

  protected constructor(epoque: Epoque<P>) {
    this.epoque = epoque;
  }

  public onDestroy(cause: unknown): unknown {
    return this.epoque.throw(cause);
  }
}
