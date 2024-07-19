import { Kind, type UnaryFunction } from '@jamashita/anden/type';
import type { MapPlan } from '../../plan/index.js';
import type { Chrono } from '../Chrono.js';
import { isSuperposition, type ISuperposition, type SReturnType } from '../ISuperposition.js';

export class AlivePlan<in out A, out B, out E> implements MapPlan<A> {
  private readonly mapper: UnaryFunction<A, SReturnType<B, E>>;
  private readonly chrono: Chrono<B, E>;

  public static of<A, B, E>(mapper: UnaryFunction<A, SReturnType<B, E>>, chrono: Chrono<B, E>): AlivePlan<A, B, E> {
    return new AlivePlan(mapper, chrono);
  }

  protected constructor(mapper: UnaryFunction<A, SReturnType<B, E>>, chrono: Chrono<B, E>) {
    this.mapper = mapper;
    this.chrono = chrono;
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

  public onMap(value: A): unknown {
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

            return this.chrono.accept(v);
          },
          (e: unknown) => {
            return this.chrono.throw(e);
          }
        );
      }

      return this.chrono.accept(mapped);
    } catch (err: unknown) {
      return this.chrono.throw(err);
    }
  }
}
