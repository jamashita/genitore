import type { Consumer, Peek, Supplier, UnaryFunction } from '@jamashita/anden/type';
import { Heisenberg, Present } from '../heisenberg/index.js';
import type { Epoque } from './Epoque.js';
import type { IUnscharferelation, UReturnType } from './IUnscharferelation.js';
import { UnscharferelationError } from './UnscharferelationError.js';
import { UnscharferelationInternal } from './UnscharferelationInternal.js';

export class Unscharferelation<out P> implements IUnscharferelation<P> {
  private readonly internal: IUnscharferelation<P>;

  public static all<P>(unscharferelations: Iterable<Unscharferelation<P>>): Unscharferelation<Array<P>> {
    const hs: Array<Unscharferelation<P>> = [...unscharferelations];

    if (hs.length === 0) {
      return Unscharferelation.ofHeisenberg(Present.of([]));
    }

    const promises: Array<Promise<Heisenberg<P>>> = hs.map((u: Unscharferelation<P>) => {
      return u.terminate();
    });

    return Unscharferelation.of((epoque: Epoque<Array<P>>) => {
      return Promise.all(promises).then((heisenbergs: Array<Heisenberg<P>>) => {
        const h: Heisenberg<Array<P>> = Heisenberg.all(heisenbergs);

        h.ifPresent((p: Array<P>) => {
          epoque.accept(p);
        });
        h.ifAbsent(() => {
          epoque.decline();
        });
        h.ifLost((cause: unknown) => {
          epoque.throw(cause);
        });
      });
    });
  }

  public static anyway<P>(unscharferelations: Iterable<Unscharferelation<P>>): Promise<Array<Heisenberg<P>>> {
    const promises: Array<Promise<Heisenberg<P>>> = [...unscharferelations].map((u: Unscharferelation<P>) => {
      return u.terminate();
    });

    return Promise.all(promises);
  }

  public static of<P>(func: Consumer<Epoque<P>>): Unscharferelation<P> {
    return Unscharferelation.ofUnscharferelation(UnscharferelationInternal.of(func));
  }

  public static ofHeisenberg<P>(heisenberg: Heisenberg<P>): Unscharferelation<P> {
    return Unscharferelation.of((epoque: Epoque<P>) => {
      if (heisenberg.isPresent()) {
        return epoque.accept(heisenberg.get());
      }
      if (heisenberg.isAbsent()) {
        return epoque.decline();
      }
      if (heisenberg.isLost()) {
        return epoque.throw(heisenberg.getCause());
      }

      return epoque.throw(new UnscharferelationError('UNEXPECTED UNSCHARFERELATION STATE'));
    });
  }

  public static ofHeisenbergAsync<P>(promise: PromiseLike<Heisenberg<P>>): Unscharferelation<P> {
    return Unscharferelation.of((epoque: Epoque<P>) => {
      return promise.then(
        (heisenberg: Heisenberg<P>) => {
          if (heisenberg.isPresent()) {
            return epoque.accept(heisenberg.get());
          }
          if (heisenberg.isAbsent()) {
            return epoque.decline();
          }
          if (heisenberg.isLost()) {
            return epoque.throw(heisenberg.getCause());
          }

          return epoque.throw(new UnscharferelationError('UNEXPECTED UNSCHARFERELATION STATE'));
        },
        (e: unknown) => {
          return epoque.throw(e);
        }
      );
    });
  }

  public static ofUnscharferelation<P>(unscharferelation: IUnscharferelation<P>): Unscharferelation<P> {
    return new Unscharferelation(unscharferelation);
  }

  protected constructor(internal: IUnscharferelation<P>) {
    this.internal = internal;
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public get(): Promise<Exclude<P, null | undefined | void>> {
    return this.internal.get();
  }

  public ifAbsent(consumer: Consumer<void>): this {
    this.internal.ifAbsent(consumer);

    return this;
  }

  public ifLost(consumer: Consumer<unknown>): this {
    this.internal.ifLost(consumer);

    return this;
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this {
    this.internal.ifPresent(consumer);

    return this;
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public map<Q = P>(mapper: UnaryFunction<Exclude<P, null | undefined | void>, UReturnType<Q>>): Unscharferelation<Q> {
    return Unscharferelation.ofUnscharferelation(this.internal.map(mapper));
  }

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  public pass(accepted: Consumer<Exclude<P, null | undefined | void>>, declined: Consumer<void>, thrown: Consumer<unknown>): this {
    this.internal.pass(accepted, declined, thrown);

    return this;
  }

  public peek(peek: Peek): this {
    this.internal.peek(peek);

    return this;
  }

  public recover<Q = P>(mapper: Supplier<UReturnType<Q>>): Unscharferelation<P | Q> {
    return Unscharferelation.ofUnscharferelation(this.internal.recover(mapper));
  }

  public serialize(): string {
    return this.internal.toString();
  }

  public terminate(): Promise<Heisenberg<P>> {
    return this.internal.terminate();
  }

  public toString(): string {
    return this.serialize();
  }
}
