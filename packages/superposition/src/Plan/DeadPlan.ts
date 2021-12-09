import { Kind, UnaryFunction } from '@jamashita/anden-type';
import { RecoveryPlan } from '@jamashita/genitore-plan';
import { Detoxicated } from '@jamashita/genitore-schrodinger';
import { Chrono } from '../Chrono';
import { containsError, isSuperposition, ISuperposition, SReturnType } from '../ISuperposition';

export class DeadPlan<B, D extends Error, E extends Error> implements RecoveryPlan<D> {
  private readonly mapper: UnaryFunction<D, SReturnType<B, E>>;
  private readonly chrono: Chrono<B, E>;

  public static of<B, D extends Error, E extends Error>(
    mapper: UnaryFunction<D, SReturnType<B, E>>,
    chrono: Chrono<B, E>
  ): DeadPlan<B, D, E> {
    return new DeadPlan<B, D, E>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<D, SReturnType<B, E>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  private forError(e: unknown): unknown {
    if (containsError<E>(e, this.chrono.getErrors())) {
      return this.chrono.decline(e);
    }

    return this.chrono.throw(e);
  }

  private forOther(v: Detoxicated<B>): unknown {
    if (v instanceof Error) {
      return this.forError(v);
    }

    return this.chrono.accept(v);
  }

  private forSuperposition(superposition: ISuperposition<B, E>): unknown {
    this.chrono.catch([...this.chrono.getErrors(), ...superposition.getErrors()]);

    return superposition.pass(
      (v: Detoxicated<B>) => {
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

      if (isSuperposition<B, E>(mapped)) {
        return this.forSuperposition(mapped);
      }
      if (Kind.isPromiseLike<Detoxicated<B> | ISuperposition<B, E>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: Detoxicated<B> | ISuperposition<B, E>) => {
            if (isSuperposition<B, E>(v)) {
              return this.forSuperposition(v);
            }

            return this.forOther(v);

          },
          (e: unknown) => {
            return this.forError(e);
          }
        );
      }

      return this.forOther(mapped);
    }
    catch (err: unknown) {
      return this.forError(err);
    }
  }
}
