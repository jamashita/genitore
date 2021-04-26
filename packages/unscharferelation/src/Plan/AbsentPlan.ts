import { Kind, Supplier } from '@jamashita/anden-type';
import { RecoveryPlan } from '../../../plan/src/Interface/RecoveryPlan';
import { Epoque } from '../Epoque/Interface/Epoque';
import { isUnscharferelation, IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';
import { Ymy } from '../Interface/Ymy';

export class AbsentPlan<P> implements RecoveryPlan<void, 'AbsentPlan'> {
  public readonly noun: 'AbsentPlan' = 'AbsentPlan';
  private readonly mapper: Supplier<IUnscharferelation<P> | PromiseLike<IUnscharferelation<P>> | PromiseLike<Ymy<P>> | Ymy<P>>;
  private readonly epoque: Epoque<P>;

  public static of<PT>(
    mapper: Supplier<IUnscharferelation<PT> | PromiseLike<IUnscharferelation<PT>> | PromiseLike<Ymy<PT>> | Ymy<PT>>,
    epoque: Epoque<PT>
  ): AbsentPlan<PT> {
    return new AbsentPlan<PT>(mapper, epoque);
  }

  protected constructor(
    mapper: Supplier<IUnscharferelation<P> | PromiseLike<IUnscharferelation<P>> | PromiseLike<Ymy<P>> | Ymy<P>>,
    epoque: Epoque<P>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    try {
      const mapped: IUnscharferelation<P> | PromiseLike<IUnscharferelation<P>> | PromiseLike<Ymy<P>> | Ymy<P> = this.mapper();

      if (Kind.isPromiseLike<IUnscharferelation<P> | Ymy<P>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: IUnscharferelation<P> | Ymy<P>) => {
            if (isUnscharferelation<P>(v)) {
              return this.forUnscharferelation(v);
            }

            return this.sync(v);
          },
          (e: unknown) => {
            return this.epoque.throw(e);
          }
        );
      }
      if (isUnscharferelation<P>(mapped)) {
        return this.forUnscharferelation(mapped);
      }

      return this.sync(mapped);
    }
    catch (err: unknown) {
      return this.epoque.throw(err);
    }
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

  private sync(v: Ymy<P>): unknown {
    if (Kind.isUndefined(v) || Kind.isNull(v)) {
      return this.epoque.decline();
    }

    return this.epoque.accept(v);
  }
}
