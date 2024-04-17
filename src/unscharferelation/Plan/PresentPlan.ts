import { Kind, type UnaryFunction } from '@jamashita/anden/type';
import type { MapPlan } from '../../plan/index.js';
import type { Epoque } from '../Epoque.js';
import { isUnscharferelation, type IUnscharferelation, type UReturnType } from '../IUnscharferelation.js';

// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
export class PresentPlan<in out P, out Q> implements MapPlan<Exclude<P, null | undefined | void>> {
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  private readonly mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>;
  private readonly epoque: Epoque<Q>;

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public static of<P, Q>(mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>, epoque: Epoque<Q>): PresentPlan<P, Q> {
    return new PresentPlan(mapper, epoque);
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  protected constructor(mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>, epoque: Epoque<Q>) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  private forOther(v: Q | null | undefined | void): unknown {
    if (Kind.isNone(v)) {
      return this.epoque.decline();
    }

    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    return this.epoque.accept(v as Exclude<Q, null | undefined | void>);
  }

  private forUnscharferelation(u: IUnscharferelation<Q>): unknown {
    return u.pass(
      // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
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

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public onMap(value: Exclude<P, null | undefined | void>): unknown {
    try {
      const mapped: UReturnType<Q> = this.mapper(value);

      if (isUnscharferelation(mapped)) {
        return this.forUnscharferelation(mapped);
      }
      // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
      if (Kind.isPromiseLike<IUnscharferelation<Q> | Q | null | undefined | void>(mapped)) {
        return mapped.then(
          // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
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
    } catch (err: unknown) {
      return this.epoque.throw(err);
    }
  }
}
