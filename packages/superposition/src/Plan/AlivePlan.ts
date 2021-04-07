import { Kind, SyncAsync, UnaryFunction } from '@jamashita/anden-type';
import { MapPlan } from '../../../plan/src/Interface/MapPlan';
import { Chrono } from '../Chrono/Interface/Chrono';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition } from '../Interface/ISuperposition';

export class AlivePlan<A, B, E extends Error> implements MapPlan<Detoxicated<A>, 'AlivePlan'> {
  public readonly noun: 'AlivePlan' = 'AlivePlan';
  private readonly mapper: UnaryFunction<Detoxicated<A>, SyncAsync<Detoxicated<B> | ISuperposition<B, E>>>;
  private readonly chrono: Chrono<B, E>;

  public static of<AT, BT, ET extends Error>(
    mapper: UnaryFunction<Detoxicated<AT>, SyncAsync<Detoxicated<BT> | ISuperposition<BT, ET>>>,
    chrono: Chrono<BT, ET>
  ): AlivePlan<AT, BT, ET> {
    return new AlivePlan<AT, BT, ET>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<Detoxicated<A>, SyncAsync<Detoxicated<B> | ISuperposition<B, E>>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  public onMap(value: Detoxicated<A>): unknown {
    try {
      const mapped: SyncAsync<Detoxicated<B> | ISuperposition<B, E>> = this.mapper(value);

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
      if (isSuperposition<B, E>(mapped)) {
        return this.forSuperposition(mapped);
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
