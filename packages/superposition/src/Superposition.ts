import { Consumer, Kind, Nullable, Peek, Supplier, Sync, UnaryFunction } from '@jamashita/anden-type';
import { Alive, DeadConstructor, Schrodinger } from '@jamashita/genitore-schrodinger';
import { Chrono } from './Chrono';
import { containsError, ISuperposition, SReturnType } from './ISuperposition';
import { SuperpositionError } from './SuperpositionError';
import { SuperpositionInternal } from './SuperpositionInternal';

export class Superposition<out A, out D extends Error> implements ISuperposition<A, D> {
  private readonly internal: ISuperposition<A, D>;

  public static all<A, D extends Error>(superpositions: Iterable<Superposition<A, D>>): Superposition<Array<A>, D> {
    const ss: Array<Superposition<A, D>> = [...superpositions];

    if (ss.length === 0) {
      return Superposition.ofSchrodinger(Alive.of([]));
    }

    const promises: Array<Promise<Schrodinger<A, D>>> = ss.map((s: Superposition<A, D>): Promise<Schrodinger<A, D>> => {
      return s.terminate();
    });

    return Superposition.of((chrono: Chrono<Array<A>, D>) => {
      ss.forEach((s: Superposition<A, D>) => {
        chrono.catch(s.getErrors());
      });

      return Promise.all(promises).then((schrodingers: Array<Schrodinger<A, D>>) => {
        const arr: Array<A> = [];
        let error: Nullable<D> = null;

        for (const schrodinger of schrodingers) {
          if (schrodinger.isContradiction()) {
            return chrono.throw(schrodinger.getCause());
          }
          if (schrodinger.isAlive()) {
            arr.push(schrodinger.get());

            continue;
          }
          if (schrodinger.isDead()) {
            if (Kind.isNull(error)) {
              error = schrodinger.getError();
            }
          }
        }

        if (!Kind.isNull(error)) {
          return chrono.decline(error);
        }

        return chrono.accept(arr);
      });
    });
  }

  public static anyway<A, D extends Error>(superpositions: Iterable<Superposition<A, D>>): Promise<Array<Schrodinger<A, D>>> {
    const promises: Array<Promise<Schrodinger<A, D>>> = [...superpositions].map((s: Superposition<A, D>): Promise<Schrodinger<A, D>> => {
      return s.terminate();
    });

    return Promise.all(promises);
  }

  public static of<A, D extends Error>(func: Consumer<Chrono<Sync<A>, D>>, ...errors: ReadonlyArray<DeadConstructor<D>>): Superposition<Sync<A>, D> {
    return Superposition.ofSuperposition(SuperpositionInternal.of(func, errors));
  }

  public static ofSchrodinger<A, D extends Error>(schrodinger: Schrodinger<Sync<A>, D>, ...errors: ReadonlyArray<DeadConstructor<D>>): Superposition<Sync<A>, D> {
    return Superposition.of((chrono: Chrono<Sync<A>, D>) => {
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

  public static ofSuperposition<A, D extends Error>(superposition: ISuperposition<A, D>): Superposition<A, D> {
    return new Superposition(superposition);
  }

  public static playground<A, D extends Error>(supplier: Supplier<Exclude<A, Error> | PromiseLike<Exclude<A, Error>>>, ...errors: ReadonlyArray<DeadConstructor<D>>): Superposition<Sync<A>, D> {
    return Superposition.of((chrono: Chrono<Sync<A>, D>) => {
      try {
        const value: Exclude<A, Error> | PromiseLike<Exclude<A, Error>> = supplier();

        if (Kind.isPromiseLike<A>(value)) {
          return value.then(
            (v: A) => {
              return chrono.accept(v as Exclude<Sync<A>, Error>);
            },
            (e: unknown) => {
              if (containsError(e, chrono.getErrors())) {
                return chrono.decline(e);
              }

              return chrono.throw(e);
            }
          );
        }

        return chrono.accept(value as Exclude<Sync<A>, Error>);
      }
      catch (err: unknown) {
        if (containsError(err, chrono.getErrors())) {
          return chrono.decline(err);
        }

        return chrono.throw(err);
      }
    }, ...errors);
  }

  protected constructor(internal: ISuperposition<A, D>) {
    this.internal = internal;
  }

  public get(): Promise<Exclude<A, Error>> {
    return this.internal.get();
  }

  public getErrors(): Set<DeadConstructor<D>> {
    return this.internal.getErrors();
  }

  public ifAlive(consumer: Consumer<Exclude<A, Error>>): this {
    this.internal.ifAlive(consumer);

    return this;
  }

  public ifContradiction(consumer: Consumer<unknown>): this {
    this.internal.ifContradiction(consumer);

    return this;
  }

  public ifDead(consumer: Consumer<D>): this {
    this.internal.ifDead(consumer);

    return this;
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Exclude<A, Error>, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): Superposition<B, D | E> {
    return Superposition.ofSuperposition(this.internal.map<B, D | E>(mapper, ...this.internal.getErrors(), ...errors));
  }

  public pass(
    accepted: Consumer<Exclude<A, Error>>,
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

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): Superposition<A | B, E> {
    return Superposition.ofSuperposition(this.internal.recover(mapper, ...errors));
  }

  public serialize(): string {
    return this.internal.toString();
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    return this.internal.terminate();
  }

  public toString(): string {
    return this.serialize();
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Exclude<A, Error>, SReturnType<B, E>>,
    dead: UnaryFunction<D, SReturnType<B, E>>,
    ...errors: Array<DeadConstructor<E>>
  ): Superposition<B, E> {
    return Superposition.ofSuperposition(this.internal.transform(alive, dead, ...errors));
  }
}
