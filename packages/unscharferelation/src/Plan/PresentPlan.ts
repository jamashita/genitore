import { Kind, Suspicious, UnaryFunction } from '@jamashita/anden-type';
import { Matter } from '@jamashita/genitore-heisenberg';
import { MapPlan } from '@jamashita/genitore-plan';
import { Epoque } from '../Epoque.js';
import { isUnscharferelation, IUnscharferelation, UReturnType } from '../IUnscharferelation.js';

export class PresentPlan<P, Q> implements MapPlan<Matter<P>, 'PresentPlan'> {
  public readonly noun: 'PresentPlan' = 'PresentPlan';
  private readonly mapper: UnaryFunction<Matter<P>, UReturnType<Q>>;
  private readonly epoque: Epoque<Q>;

  public static of<PT, QT>(
    mapper: UnaryFunction<Matter<PT>, UReturnType<QT>>,
    epoque: Epoque<QT>
  ): PresentPlan<PT, QT> {
    return new PresentPlan<PT, QT>(mapper, epoque);
  }

  protected constructor(
    mapper: UnaryFunction<Matter<P>, UReturnType<Q>>,
    epoque: Epoque<Q>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onMap(value: Matter<P>): unknown {
    try {
      const mapped: UReturnType<Q> = this.mapper(value);

      if (isUnscharferelation<Q>(mapped)) {
        return this.forUnscharferelation(mapped);
      }
      if (Kind.isPromiseLike<IUnscharferelation<Q> | Suspicious<Matter<Q>>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: IUnscharferelation<Q> | Suspicious<Matter<Q>>) => {
            if (isUnscharferelation<Q>(v)) {
              return this.forUnscharferelation(v);
            }

            return this.forOther(v);
          },
          (e: unknown) => {
            return this.epoque.throw(e);
          }
        );
      }

      return this.forOther(mapped);
    }
    catch (err: unknown) {
      return this.epoque.throw(err);
    }
  }

  private forOther(v: Suspicious<Matter<Q>>): unknown {
    if (Kind.isUndefined(v) || Kind.isNull(v)) {
      return this.epoque.decline();
    }

    return this.epoque.accept(v);
  }

  private forUnscharferelation(u: IUnscharferelation<Q>): unknown {
    return u.pass(
      (v: Matter<Q>) => {
        return this.epoque.accept(v);
      },
      () => {
        return this.epoque.decline();
      },
      (c: unknown) => {
        return this.epoque.throw(c);
      }
    );
  }
}
