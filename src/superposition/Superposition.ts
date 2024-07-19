import type { Consumer, Peek, UnaryFunction } from '@jamashita/anden/type';
import { Alive, Schrodinger } from '../schrodinger/index.js';
import type { Chrono } from './Chrono.js';
import type { ISuperposition, SReturnType } from './ISuperposition.js';
import { SuperpositionError } from './SuperpositionError.js';
import { SuperpositionInternal } from './SuperpositionInternal.js';

export class Superposition<out A, out D> implements ISuperposition<A, D> {
  private readonly internal: ISuperposition<A, D>;

  public static all<A, D>(superpositions: Iterable<Superposition<A, D>>): Superposition<Array<A>, D> {
    const ss = [...superpositions];

    if (ss.length === 0) {
      return Superposition.ofSchrodinger(Alive.of([]));
    }

    const promises = ss.map((s: Superposition<A, D>) => {
      return s.terminate();
    });

    return Superposition.of((chrono: Chrono<Array<A>, D>) => {
      return Promise.all(promises).then((schrodingers: Array<Schrodinger<A, D>>) => {
        const s = Schrodinger.all(schrodingers);

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

  public static anyway<A, D>(superpositions: Iterable<Superposition<A, D>>): Promise<Array<Schrodinger<A, D>>> {
    const promises = [...superpositions].map((s: Superposition<A, D>) => {
      return s.terminate();
    });

    return Promise.all(promises);
  }

  public static of<A, D>(func: Consumer<Chrono<A, D>>): Superposition<A, D> {
    return Superposition.ofSuperposition(SuperpositionInternal.of(func));
  }

  public static ofSchrodinger<A, D>(schrodinger: Schrodinger<A, D>): Superposition<A, D> {
    return Superposition.of((chrono: Chrono<A, D>) => {
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

  public static ofSchrodingerAsync<A, D>(promise: PromiseLike<Schrodinger<A, D>>): Superposition<A, D> {
    return Superposition.of((chrono: Chrono<A, D>) => {
      promise.then(
        (schrodinger: Schrodinger<A, D>) => {
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
        },
        (e: unknown) => {
          return chrono.throw(e);
        }
      );
    });
  }

  public static ofSuperposition<A, D>(superposition: ISuperposition<A, D>): Superposition<A, D> {
    return new Superposition(superposition);
  }

  protected constructor(internal: ISuperposition<A, D>) {
    this.internal = internal;
  }

  public get(): Promise<A> {
    return this.internal.get();
  }

  public ifAlive(consumer: Consumer<A>): this {
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

  public map<B = A, E = D>(mapper: UnaryFunction<A, SReturnType<B, E>>): Superposition<B, D | E> {
    return Superposition.ofSuperposition(this.internal.map<B, D | E>(mapper));
  }

  public pass(accepted: Consumer<A>, declined: Consumer<D>, thrown: Consumer<unknown>): this {
    this.internal.pass(accepted, declined, thrown);

    return this;
  }

  public peek(peek: Peek): this {
    this.internal.peek(peek);

    return this;
  }

  public recover<B = A, E = D>(mapper: UnaryFunction<D, SReturnType<B, E>>): Superposition<A | B, E> {
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

  public transform<B = A, E = D>(alive: UnaryFunction<A, SReturnType<B, E>>, dead: UnaryFunction<D, SReturnType<B, E>>): Superposition<B, E> {
    return Superposition.ofSuperposition(this.internal.transform(alive, dead));
  }
}
