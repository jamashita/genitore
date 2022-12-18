import { Kind, UnaryFunction } from '@jamashita/anden/type';
import { MapPlan } from '../../plan/index.js';
import { Epoque } from '../Epoque.js';
import { isUnscharferelation, IUnscharferelation, UReturnType } from '../IUnscharferelation.js';

export class PresentPlan<in out P, out Q> implements MapPlan<Exclude<P, null | undefined | void>> {
  private readonly mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>;
  private readonly epoque: Epoque<Q>;

  public static of<P, Q>(
    mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>,
    epoque: Epoque<Q>
  ): PresentPlan<P, Q> {
    return new PresentPlan(mapper, epoque);
  }

  protected constructor(
    mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>,
    epoque: Epoque<Q>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  private forOther(v: Q | null | undefined | void): unknown {
    if (Kind.isNone(v)) {
      return this.epoque.decline();
    }

    return this.epoque.accept(v as Exclude<Q, null | undefined | void>);
  }

  private forUnscharferelation(u: IUnscharferelation<Q>): unknown {
    return u.pass(
      (v: Exclude<Q, null | undefined | void>) => {
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

  public onMap(value: Exclude<P, null | undefined | void>): unknown {
    try {
      const mapped: UReturnType<Q> = this.mapper(value);

      if (isUnscharferelation(mapped)) {
        return this.forUnscharferelation(mapped);
      }
      if (Kind.isPromiseLike<IUnscharferelation<Q> | Q | null | undefined | void>(mapped)) {
        return mapped.then(
          (v: IUnscharferelation<Q> | Q | null | undefined | void) => {
            if (isUnscharferelation(v)) {
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
}
