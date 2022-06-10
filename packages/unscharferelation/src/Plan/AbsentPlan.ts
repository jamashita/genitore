import { Kind, Supplier } from '@jamashita/anden-type';
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
    return new AbsentPlan(mapper, epoque);
  }

  protected constructor(
    mapper: Supplier<UReturnType<P>>,
    epoque: Epoque<P>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  private forOther(v: P | null | undefined | void): unknown {
    if (Kind.isNone(v)) {
      return this.epoque.decline();
    }

    return this.epoque.accept(v as Exclude<P, null | undefined | void>);
  }

  private forUnscharferelation(unscharferelation: IUnscharferelation<P>): unknown {
    return unscharferelation.pass(
      (v: Exclude<P, null | undefined | void>) => {
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

      if (isUnscharferelation(mapped)) {
        return this.forUnscharferelation(mapped);
      }
      if (Kind.isPromiseLike<IUnscharferelation<P> | P | null | undefined | void>(mapped)) {
        return mapped.then(
          (v: IUnscharferelation<P> | P | null | undefined | void) => {
            if (isUnscharferelation(v)) {
              return this.forUnscharferelation(v);
            }

            return this.forOther(v as null | undefined | void);
          },
          (e: unknown) => {
            return this.epoque.throw(e);
          }
        );
      }

      return this.forOther(mapped as null | undefined | void);
    }
    catch (err: unknown) {
      return this.epoque.throw(err);
    }
  }
}
