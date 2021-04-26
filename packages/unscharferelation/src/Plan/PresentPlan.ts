import { Kind, UnaryFunction } from '@jamashita/anden-type';
import { MapPlan } from '../../../plan/src/Interface/MapPlan';
import { Epoque } from '../Epoque/Interface/Epoque';
import { isUnscharferelation, IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';
import { Ymy } from '../Interface/Ymy';

export class PresentPlan<P, Q> implements MapPlan<Matter<P>, 'PresentPlan'> {
  public readonly noun: 'PresentPlan' = 'PresentPlan';
  // private readonly mapper: UnaryFunction<Matter<P>, SyncAsync<IUnscharferelation<Q> | Suspicious<Matter<Q>>>>;
  private readonly mapper: UnaryFunction<Matter<P>, IUnscharferelation<Q> | PromiseLike<IUnscharferelation<Q>> | PromiseLike<Ymy<Q>> | Ymy<Q>>;
  private readonly epoque: Epoque<Q>;

  public static of<PT, QT>(
    mapper: UnaryFunction<Matter<PT>, IUnscharferelation<QT> | PromiseLike<IUnscharferelation<QT>> | PromiseLike<Ymy<QT>> | Ymy<QT>>,
    epoque: Epoque<QT>
  ): PresentPlan<PT, QT> {
    return new PresentPlan<PT, QT>(mapper, epoque);
  }

  protected constructor(
    mapper: UnaryFunction<Matter<P>, IUnscharferelation<Q> | PromiseLike<IUnscharferelation<Q>> | PromiseLike<Ymy<Q>> | Ymy<Q>>,
    epoque: Epoque<Q>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onMap(value: Matter<P>): unknown {
    try {
      const mapped: IUnscharferelation<Q> | PromiseLike<IUnscharferelation<Q>> | PromiseLike<Ymy<Q>> | Ymy<Q> = this.mapper(value);

      if (Kind.isPromiseLike<IUnscharferelation<Q> | Ymy<Q>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: IUnscharferelation<Q> | Ymy<Q>) => {
            if (isUnscharferelation<Q>(v)) {
              return this.forUnscharferelation(v);
            }

            return this.sync(v);
          },
          (e: unknown) => {
            return this.epoque.throw(e);
          }
        );
      }
      if (isUnscharferelation<Q>(mapped)) {
        return this.forUnscharferelation(mapped);
      }

      return this.sync(mapped);
    }
    catch (err: unknown) {
      return this.epoque.throw(err);
    }
  }

  private forUnscharferelation(unscharferelation: IUnscharferelation<Q>): unknown {
    return unscharferelation.pass(
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

  private sync(v: Ymy<Q>): unknown {
    if (Kind.isUndefined(v) || Kind.isNull(v)) {
      return this.epoque.decline();
    }

    return this.epoque.accept(v);
  }
}
