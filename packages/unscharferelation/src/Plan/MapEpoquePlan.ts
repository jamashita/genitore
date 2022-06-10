import { MapPlan } from '@jamashita/genitore-plan';
import { Epoque } from '../Epoque';

export class MapEpoquePlan<out P> implements MapPlan<Exclude<P, null | undefined | void>> {
  private readonly epoque: Epoque<P>;

  public static of<P>(epoque: Epoque<P>): MapEpoquePlan<P> {
    return new MapEpoquePlan(epoque);
  }

  protected constructor(epoque: Epoque<P>) {
    this.epoque = epoque;
  }

  public onMap(value: Exclude<P, null | undefined | void>): unknown {
    return this.epoque.accept(value);
  }
}
