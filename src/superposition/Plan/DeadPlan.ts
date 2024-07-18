import { Kind, type UnaryFunction } from '@jamashita/anden/type';
import type { RecoveryPlan } from '../../plan/index.js';
import type { Chrono } from '../Chrono.js';
import { isSuperposition, type ISuperposition, type SReturnType } from '../ISuperposition.js';

export class DeadPlan<out B, in out D, E> implements RecoveryPlan<D> {
  private readonly mapper: UnaryFunction<D, SReturnType<B, E>>;
  private readonly chrono: Chrono<B, E>;

  public static of<B, D, E>(mapper: UnaryFunction<D, SReturnType<B, E>>, chrono: Chrono<B, E>): DeadPlan<B, D, E> {
    return new DeadPlan(mapper, chrono);
  }

  protected constructor(mapper: UnaryFunction<D, SReturnType<B, E>>, chrono: Chrono<B, E>) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  private forOther(v: B): unknown {
    return this.chrono.accept(v);
  }

  private forSuperposition(superposition: ISuperposition<B, E>): unknown {
    return superposition.pass(
      (v: B) => {
        return this.chrono.accept(v);
      },
      (e: E) => {
        return this.chrono.decline(e);
      },
      (c: unknown) => {
        return this.chrono.throw(c);
      }
    );
  }

  public onRecover(value: D): unknown {
    try {
      const mapped: SReturnType<B, E> = this.mapper(value);

      if (isSuperposition(mapped)) {
        return this.forSuperposition(mapped);
      }
      if (Kind.isPromiseLike<B | ISuperposition<B, E>>(mapped)) {
        return mapped.then(
          (v: B | ISuperposition<B, E>) => {
            if (isSuperposition(v)) {
              return this.forSuperposition(v);
            }

            return this.forOther(v);
          },
          (e: unknown) => {
            return this.chrono.throw(e);
          }
        );
      }

      return this.forOther(mapped);
    } catch (err: unknown) {
      return this.chrono.throw(err);
    }
  }
}
