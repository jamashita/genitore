import { Kind, UnaryFunction } from '@jamashita/anden-type';
import { MapPlan } from '@jamashita/genitore-plan';
import { Chrono } from '../Chrono/Interface/Chrono';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition, SReturnType } from '../Interface/ISuperposition';

export class AlivePlan<A, B, E extends Error> implements MapPlan<Detoxicated<A>, 'AlivePlan'> {
  public readonly noun: 'AlivePlan' = 'AlivePlan';
  private readonly mapper: UnaryFunction<Detoxicated<A>, SReturnType<B, E>>;
  private readonly chrono: Chrono<B, E>;

  public static of<AT, BT, ET extends Error>(
    mapper: UnaryFunction<Detoxicated<AT>, SReturnType<BT, ET>>,
    chrono: Chrono<BT, ET>
  ): AlivePlan<AT, BT, ET> {
    return new AlivePlan<AT, BT, ET>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<Detoxicated<A>, SReturnType<B, E>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  public onMap(value: Detoxicated<A>): unknown {
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

  private forOther(v: Detoxicated<B>): unknown {
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
