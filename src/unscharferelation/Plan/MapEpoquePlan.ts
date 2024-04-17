import type { MapPlan } from '../../plan/index.js';
import type { Epoque } from '../Epoque.js';

// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
export class MapEpoquePlan<out P> implements MapPlan<Exclude<P, null | undefined | void>> {
  private readonly epoque: Epoque<P>;

  public static of<P>(epoque: Epoque<P>): MapEpoquePlan<P> {
    return new MapEpoquePlan(epoque);
  }

  protected constructor(epoque: Epoque<P>) {
    this.epoque = epoque;
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public onMap(value: Exclude<P, null | undefined | void>): unknown {
    return this.epoque.accept(value);
  }
}
