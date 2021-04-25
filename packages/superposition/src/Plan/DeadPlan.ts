import { Kind, SyncAsync, UnaryFunction } from '@jamashita/anden-type';
import { RecoveryPlan } from '@jamashita/genitore-plan';
import { Chrono } from '../Chrono/Interface/Chrono';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition } from '../Interface/ISuperposition';

export class DeadPlan<B, D extends Error, E extends Error> implements RecoveryPlan<D, 'DeadPlan'> {
  public readonly noun: 'DeadPlan' = 'DeadPlan';
  private readonly mapper: UnaryFunction<D, SyncAsync<Detoxicated<B> | ISuperposition<B, E>>>;
  private readonly chrono: Chrono<B, E>;

  public static of<BT, DT extends Error, ET extends Error>(
    mapper: UnaryFunction<DT, SyncAsync<Detoxicated<BT> | ISuperposition<BT, ET>>>,
    chrono: Chrono<BT, ET>
  ): DeadPlan<BT, DT, ET> {
    return new DeadPlan<BT, DT, ET>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<D, SyncAsync<Detoxicated<B> | ISuperposition<B, E>>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  public onRecover(value: D): unknown {
    try {
      const mapped: SyncAsync<Detoxicated<B> | ISuperposition<B, E>> = this.mapper(value);

      if (isSuperposition<B, E>(mapped)) {
        return this.forError(mapped);
      }
      if (Kind.isPromiseLike<Detoxicated<B> | ISuperposition<B, E>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: Detoxicated<B> | ISuperposition<B, E>) => {
            if (isSuperposition<B, E>(v)) {
              return this.forSuperposition(v);
            }

            return this.chrono.accept(v);
          },
          (e: unknown) => {
            return this.forError(e);
          }
        );
      }

      return this.chrono.accept(mapped);
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

  private forError(e: unknown): unknown {
    if (containsError<E>(e, this.chrono.getErrors())) {
      return this.chrono.decline(e);
    }

    return this.chrono.throw(e);
  }
}
