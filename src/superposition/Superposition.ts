import { type Consumer, Kind, type Peek, type Supplier, type UnaryFunction } from '@jamashita/anden/type';
import { Alive, Schrodinger } from '../schrodinger/index.js';
import type { Chrono } from './Chrono.js';
import type { ISuperposition, SReturnType } from './ISuperposition.js';
import { SuperpositionError } from './SuperpositionError.js';
import { SuperpositionInternal } from './SuperpositionInternal.js';

export class Superposition<out A, out D extends Error> implements ISuperposition<A, D> {
  private readonly internal: ISuperposition<A, D>;

  public static all<A, D extends Error>(superpositions: Iterable<Superposition<A, D>>): Superposition<Array<A>, D> {
    const ss: Array<Superposition<A, D>> = [...superpositions];

    if (ss.length === 0) {
      return Superposition.ofSchrodinger(Alive.of([]));
    }

    const promises: Array<Promise<Schrodinger<A, D>>> = ss.map((s: Superposition<A, D>) => {
      return s.terminate();
    });

    return Superposition.of((chrono: Chrono<Array<A>, D>) => {
      return Promise.all(promises).then((schrodingers: Array<Schrodinger<A, D>>) => {
        const s: Schrodinger<Array<A>, D> = Schrodinger.all(schrodingers);

        s.ifAlive((a: Array<A>) => {
          chrono.accept(a);
        });
        s.ifDead((err: D) => {
          chrono.decline(err);
        });
        s.ifContradiction((cause: unknown) => {
          chrono.throw(cause);
        });
      });
    });
  }

  public static anyway<A, D extends Error>(superpositions: Iterable<Superposition<A, D>>): Promise<Array<Schrodinger<A, D>>> {
    const promises: Array<Promise<Schrodinger<A, D>>> = [...superpositions].map((s: Superposition<A, D>) => {
      return s.terminate();
    });

    return Promise.all(promises);
  }

  public static of<A, D extends Error>(func: Consumer<Chrono<Awaited<A>, D>>): Superposition<Awaited<A>, D> {
    return Superposition.ofSuperposition(SuperpositionInternal.of(func));
  }

  public static ofSchrodinger<A, D extends Error>(schrodinger: Schrodinger<Awaited<A>, D>): Superposition<Awaited<A>, D> {
    return Superposition.of((chrono: Chrono<Awaited<A>, D>) => {
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
    });
  }

  public static ofSuperposition<A, D extends Error>(superposition: ISuperposition<A, D>): Superposition<A, D> {
    return new Superposition(superposition);
  }

  public static playground<A, D extends Error>(supplier: Supplier<Exclude<A, Error> | PromiseLike<Exclude<A, Error>>>): Superposition<Awaited<A>, D> {
    return Superposition.of((chrono: Chrono<Awaited<A>, D>) => {
      try {
        const value: Exclude<A, Error> | PromiseLike<Exclude<A, Error>> = supplier();

        if (Kind.isPromiseLike<A>(value)) {
          return value.then(
            (v: A) => {
              return chrono.accept(v as Exclude<Awaited<A>, Error>);
            },
            (e: unknown) => {
              return chrono.throw(e);
            }
          );
        }

        return chrono.accept(value as Exclude<Awaited<A>, Error>);
      } catch (err: unknown) {
        return chrono.throw(err);
      }
    });
  }

  protected constructor(internal: ISuperposition<A, D>) {
    this.internal = internal;
  }

  public get(): Promise<Exclude<A, Error>> {
    return this.internal.get();
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

  public map<B = A, E extends Error = D>(mapper: UnaryFunction<Exclude<A, Error>, SReturnType<B, E>>): Superposition<B, D | E> {
    return Superposition.ofSuperposition(this.internal.map<B, D | E>(mapper));
  }

  public pass(accepted: Consumer<Exclude<A, Error>>, declined: Consumer<D>, thrown: Consumer<unknown>): this {
    this.internal.pass(accepted, declined, thrown);

    return this;
  }

  public peek(peek: Peek): this {
    this.internal.peek(peek);

    return this;
  }

  public recover<B = A, E extends Error = D>(mapper: UnaryFunction<D, SReturnType<B, E>>): Superposition<A | B, E> {
    return Superposition.ofSuperposition(this.internal.recover(mapper));
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
    dead: UnaryFunction<D, SReturnType<B, E>>
  ): Superposition<B, E> {
    return Superposition.ofSuperposition(this.internal.transform(alive, dead));
  }
}
