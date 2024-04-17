import { Kind, type Supplier } from '@jamashita/anden/type';
import type { RecoveryPlan } from '../../plan/index.js';
import type { Epoque } from '../Epoque.js';
import { isUnscharferelation, type IUnscharferelation, type UReturnType } from '../IUnscharferelation.js';

export class AbsentPlan<out P> implements RecoveryPlan<void> {
  private readonly mapper: Supplier<UReturnType<P>>;
  private readonly epoque: Epoque<P>;

  public static of<P>(mapper: Supplier<UReturnType<P>>, epoque: Epoque<P>): AbsentPlan<P> {
    return new AbsentPlan(mapper, epoque);
  }

  protected constructor(mapper: Supplier<UReturnType<P>>, epoque: Epoque<P>) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  private forOther(v: P | null | undefined | void): unknown {
    if (Kind.isNone(v)) {
      return this.epoque.decline();
    }

    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    return this.epoque.accept(v as Exclude<P, null | undefined | void>);
  }

  private forUnscharferelation(unscharferelation: IUnscharferelation<P>): unknown {
    return unscharferelation.pass(
      // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
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
      // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
      if (Kind.isPromiseLike<IUnscharferelation<P> | P | null | undefined | void>(mapped)) {
        return mapped.then(
          // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
          (v: IUnscharferelation<P> | P | null | undefined | void) => {
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
