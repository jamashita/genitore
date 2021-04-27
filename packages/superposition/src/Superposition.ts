import { Consumer, Kind, Nullable, Peek, Supplier, UnaryFunction } from '@jamashita/anden-type';
import { Chrono } from './Chrono/Interface/Chrono';
import { SuperpositionError } from './Error/SuperpositionError';
import { Bdb } from './Interface/Bdb';
import { DeadConstructor } from './Interface/DeadConstructor';
import { Detoxicated } from './Interface/Detoxicated';
import { containsError, ISuperposition } from './Interface/ISuperposition';
import { Dead } from './Schrodinger/Dead';
import { Schrodinger } from './Schrodinger/Schrodinger';
import { SuperpositionInternal } from './SuperpositionInternal';

export class Superposition<A, D extends Error> implements ISuperposition<A, D, 'Superposition'> {
  public readonly noun: 'Superposition' = 'Superposition';
  private readonly internal: ISuperposition<A, D>;

  public static all<AT, DT extends Error>(superpositions: Iterable<Superposition<AT, DT>>): Superposition<Array<AT>, DT> {
    const ss: Array<Superposition<AT, DT>> = [...superpositions];

    if (ss.length === 0) {
      return Superposition.alive<Array<AT>, DT>([]);
    }

    const promises: Array<Promise<Schrodinger<AT, DT>>> = ss.map<Promise<Schrodinger<AT, DT>>>((s: Superposition<AT, DT>) => {
      return s.terminate();
    });

    return Superposition.of<Array<AT>, DT>((chrono: Chrono<Array<AT>, DT>) => {
      ss.forEach((s: Superposition<AT, DT>) => {
        chrono.catch(s.getErrors());
      });

      return Promise.all<Schrodinger<AT, DT>>(promises).then<unknown, unknown>(
        (schrodingers: Array<Schrodinger<AT, DT>>) => {
          const arr: Array<AT> = [];
          let dead: Nullable<Dead<AT, DT>> = null;

          for (const schrodinger of schrodingers) {
            if (schrodinger.isContradiction()) {
              return chrono.throw(schrodinger.getCause());
            }
            if (schrodinger.isAlive()) {
              arr.push(schrodinger.get());

              continue;
            }
            if (schrodinger.isDead()) {
              dead = schrodinger;
            }
          }

          if (!Kind.isNull(dead)) {
            return chrono.decline(dead.getError());
          }

          return chrono.accept(arr);
        }
      );
    });
  }

  public static anyway<AT, DT extends Error>(superpositions: Iterable<Superposition<AT, DT>>): Promise<Array<Schrodinger<AT, DT>>> {
    const promises: Array<Promise<Schrodinger<AT, DT>>> = [...superpositions].map<Promise<Schrodinger<AT, DT>>>((s: Superposition<AT, DT>) => {
      return s.terminate();
    });

    return Promise.all<Schrodinger<AT, DT>>(promises);
  }

  public static playground<AT, DT extends Error>(supplier: Supplier<Detoxicated<AT> | PromiseLike<Detoxicated<AT>>>, ...errors: ReadonlyArray<DeadConstructor<DT>>): Superposition<AT, DT> {
    return Superposition.of<AT, DT>((chrono: Chrono<AT, DT>) => {
      try {
        const value: Detoxicated<AT> | PromiseLike<Detoxicated<AT>> = supplier();

        if (Kind.isPromiseLike<Detoxicated<AT>>(value)) {
          return value.then<unknown, unknown>(
            (v: Detoxicated<AT>) => {
              return chrono.accept(v);
            },
            (e: unknown) => {
              if (containsError<DT>(e, chrono.getErrors())) {
                return chrono.decline(e);
              }

              return chrono.throw(e);
            }
          );
        }

        return chrono.accept(value);
      }
      catch (err: unknown) {
        if (containsError<DT>(err, chrono.getErrors())) {
          return chrono.decline(err);
        }

        return chrono.throw(err);
      }
    }, ...errors);
  }

  public static ofSchrodinger<AT, DT extends Error>(schrodinger: Schrodinger<AT, DT>, ...errors: ReadonlyArray<DeadConstructor<DT>>): Superposition<AT, DT> {
    return Superposition.of<AT, DT>((chrono: Chrono<AT, DT>) => {
      chrono.catch(errors);

      if (schrodinger.isAlive()) {
        return chrono.accept(schrodinger.get());
      }
      if (schrodinger.isDead()) {
        return chrono.decline(schrodinger.getError());
      }
      if (schrodinger.isContradiction()) {
        return chrono.throw(schrodinger.getCause());
      }

      return chrono.throw(new SuperpositionError('UNEXPECTED SCHRODINGER STATE'));
    }, ...errors);
  }

  public static alive<AT, DT extends Error>(value: Detoxicated<AT> | PromiseLike<Detoxicated<AT>>, ...errors: ReadonlyArray<DeadConstructor<DT>>): Superposition<AT, DT> {
    return Superposition.of<AT, DT>((chrono: Chrono<AT, DT>) => {
      if (Kind.isPromiseLike<Detoxicated<AT>>(value)) {
        return value.then<unknown, unknown>(
          (v: Detoxicated<AT>) => {
            return chrono.accept(v);
          },
          (e: unknown) => {
            return chrono.throw(e);
          }
        );
      }

      return chrono.accept(value);
    }, ...errors);
  }

  public static dead<AT, DT extends Error>(error: DT | PromiseLike<Detoxicated<AT>>, ...errors: ReadonlyArray<DeadConstructor<DT>>): Superposition<AT, DT> {
    return Superposition.of<AT, DT>((chrono: Chrono<AT, DT>) => {
      if (Kind.isPromiseLike<Detoxicated<AT>>(error)) {
        return error.then<unknown, unknown>(
          () => {
            return chrono.throw(new SuperpositionError('NOT REJECTED'));
          },
          (e: unknown) => {
            if (containsError<DT>(e, chrono.getErrors())) {
              return chrono.decline(e);
            }

            return chrono.throw(e);
          }
        );
      }
      if (containsError<DT>(error, chrono.getErrors())) {
        return chrono.decline(error);
      }

      return chrono.throw(error);
    }, ...errors);
  }

  public static of<AT, DT extends Error>(func: UnaryFunction<Chrono<AT, DT>, unknown>, ...errors: ReadonlyArray<DeadConstructor<DT>>): Superposition<AT, DT> {
    return Superposition.ofSuperposition<AT, DT>(SuperpositionInternal.of<AT, DT>(func, errors));
  }

  public static ofSuperposition<AT, DT extends Error>(superposition: ISuperposition<AT, DT>): Superposition<AT, DT> {
    return new Superposition<AT, DT>(superposition);
  }

  protected constructor(internal: ISuperposition<A, D>) {
    this.internal = internal;
  }

  public serialize(): string {
    return this.internal.toString();
  }

  public toString(): string {
    return this.serialize();
  }

  public get(): Promise<Detoxicated<A>> {
    return this.internal.get();
  }

  public getErrors(): Set<DeadConstructor<D>> {
    return this.internal.getErrors();
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    return this.internal.terminate();
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, Bdb<B> | ISuperposition<B, E> | PromiseLike<Bdb<B>> | PromiseLike<ISuperposition<B, E>>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): Superposition<B, D | E> {
    return Superposition.ofSuperposition<B, D | E>(this.internal.map<B, D | E>(mapper, ...this.internal.getErrors(), ...errors));
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, Bdb<B> | ISuperposition<B, E> | PromiseLike<Bdb<B>> | PromiseLike<ISuperposition<B, E>>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): Superposition<A | B, E> {
    return Superposition.ofSuperposition<A | B, E>(this.internal.recover<A | B, E>(mapper, ...errors));
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, Bdb<B> | ISuperposition<B, E> | PromiseLike<Bdb<B>> | PromiseLike<ISuperposition<B, E>>>,
    dead: UnaryFunction<D, Bdb<B> | ISuperposition<B, E> | PromiseLike<Bdb<B>> | PromiseLike<ISuperposition<B, E>>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): Superposition<B, E> {
    return Superposition.ofSuperposition<B, E>(this.internal.transform<B, E>(alive, dead, ...errors));
  }

  public ifAlive(consumer: Consumer<Detoxicated<A>>): this {
    this.internal.ifAlive(consumer);

    return this;
  }

  public ifDead(consumer: Consumer<D>): this {
    this.internal.ifDead(consumer);

    return this;
  }

  public ifContradiction(consumer: Consumer<unknown>): this {
    this.internal.ifContradiction(consumer);

    return this;
  }

  public pass(
    accepted: Consumer<Detoxicated<A>>,
    declined: Consumer<D>,
    thrown: Consumer<unknown>
  ): this {
    this.internal.pass(accepted, declined, thrown);

    return this;
  }

  public peek(peek: Peek): this {
    this.internal.peek(peek);

    return this;
  }
}
