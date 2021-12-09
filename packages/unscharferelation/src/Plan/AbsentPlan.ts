import { Kind, Supplier, Suspicious } from '@jamashita/anden-type';
import { Matter } from '@jamashita/genitore-heisenberg';
import { RecoveryPlan } from '@jamashita/genitore-plan';
import { Epoque } from '../Epoque';
import { isUnscharferelation, IUnscharferelation, UReturnType } from '../IUnscharferelation';

export class AbsentPlan<P> implements RecoveryPlan<void> {
  private readonly mapper: Supplier<UReturnType<P>>;
  private readonly epoque: Epoque<P>;

  public static of<P>(
    mapper: Supplier<UReturnType<P>>,
    epoque: Epoque<P>
  ): AbsentPlan<P> {
    return new AbsentPlan<P>(mapper, epoque);
  }

  protected constructor(
    mapper: Supplier<UReturnType<P>>,
    epoque: Epoque<P>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  private forOther(v: Suspicious<Matter<P>>): unknown {
    if (Kind.isUndefined(v) || Kind.isNull(v)) {
      return this.epoque.decline();
    }

    return this.epoque.accept(v);
  }

  private forUnscharferelation(unscharferelation: IUnscharferelation<P>): unknown {
    return unscharferelation.pass(
      (v: Matter<P>) => {
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

  public onRecover(): unknown {
    try {
      const mapped: UReturnType<P> = this.mapper();

      if (isUnscharferelation<P>(mapped)) {
        return this.forUnscharferelation(mapped);
      }
      if (Kind.isPromiseLike<IUnscharferelation<P> | Suspicious<Matter<P>>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: IUnscharferelation<P> | Suspicious<Matter<P>>) => {
            if (isUnscharferelation<P>(v)) {
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
