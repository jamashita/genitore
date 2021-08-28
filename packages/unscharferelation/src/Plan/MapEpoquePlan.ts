import { Matter } from '@jamashita/genitore-heisenberg';
import { MapPlan } from '@jamashita/genitore-plan';
import { Epoque } from '../Epoque';

export class MapEpoquePlan<P> implements MapPlan<Matter<P>, 'MapEpoquePlan'> {
  public readonly noun: 'MapEpoquePlan' = 'MapEpoquePlan';
  private readonly epoque: Epoque<P>;

  public static of<PT>(epoque: Epoque<PT>): MapEpoquePlan<PT> {
    return new MapEpoquePlan<PT>(epoque);
  }

  protected constructor(epoque: Epoque<P>) {
    this.epoque = epoque;
  }

  public onMap(value: Matter<P>): unknown {
    return this.epoque.accept(value);
  }
}
