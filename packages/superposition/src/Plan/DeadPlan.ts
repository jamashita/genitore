import { Kind, UnaryFunction } from '@jamashita/anden-type';
import { RecoveryPlan } from '@jamashita/genitore-plan';
import { Chrono } from '../Chrono/Interface/Chrono';
import { Bdb } from '../Interface/Bdb';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition, SReturnType } from '../Interface/ISuperposition';

export class DeadPlan<B, D extends Error, E extends Error> implements RecoveryPlan<D, 'DeadPlan'> {
  public readonly noun: 'DeadPlan' = 'DeadPlan';
  private readonly mapper: UnaryFunction<D, SReturnType<B, E>>;
  private readonly chrono: Chrono<B, E>;

  public static of<BT, DT extends Error, ET extends Error>(
    mapper: UnaryFunction<DT, SReturnType<BT, ET>>,
    chrono: Chrono<BT, ET>
  ): DeadPlan<BT, DT, ET> {
    return new DeadPlan<BT, DT, ET>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<D, SReturnType<B, E>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  public onRecover(value: D): unknown {
    try {
      const mapped: SReturnType<B, E> = this.mapper(value);

      if (isSuperposition<B, E>(mapped)) {
        return this.forSuperposition(mapped);
      }
      if (Kind.isPromiseLike<Bdb<B> | ISuperposition<B, E>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: Bdb<B> | ISuperposition<B, E>) => {
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

  private forOther(v: Bdb<B>): unknown {
    if (v instanceof Error) {
      return this.forError(v);
    }

    return this.chrono.accept(v);
  }

  private forError(e: unknown): unknown {
    if (containsError<E>(e, this.chrono.getErrors())) {
      return this.chrono.decline(e);
    }

    return this.chrono.throw(e);
  }
}
