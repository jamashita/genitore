import type { DestroyPlan } from '../../plan/index.js';
import type { Epoque } from '../Epoque.js';

export class DestroyEpoquePlan<out P> implements DestroyPlan {
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
