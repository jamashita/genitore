import { Matter } from '@jamashita/genitore-heisenberg';
import { MapPlan } from '@jamashita/genitore-plan';
import { Epoque } from '../Epoque';

export class MapEpoquePlan<P> implements MapPlan<Matter<P>> {
  private readonly epoque: Epoque<P>;

  public static of<P>(epoque: Epoque<P>): MapEpoquePlan<P> {
    return new MapEpoquePlan<P>(epoque);
  }

  protected constructor(epoque: Epoque<P>) {
    this.epoque = epoque;
  }

  public onMap(value: Matter<P>): unknown {
    return this.epoque.accept(value);
  }
}
