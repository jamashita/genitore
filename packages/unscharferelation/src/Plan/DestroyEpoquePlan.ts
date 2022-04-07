import { DestroyPlan } from '@jamashita/genitore-plan';
import { Epoque } from '../Epoque';

export class DestroyEpoquePlan<P> implements DestroyPlan {
  private readonly epoque: Epoque<P>;

  public static of<P>(epoque: Epoque<P>): DestroyEpoquePlan<P> {
    return new DestroyEpoquePlan(epoque);
  }

  protected constructor(epoque: Epoque<P>) {
    this.epoque = epoque;
  }

  public onDestroy(cause: unknown): unknown {
    return this.epoque.throw(cause);
  }
}
