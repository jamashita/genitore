import { Consumer, Kind, Peek, Supplier, Suspicious, SyncAsync, UnaryFunction } from '@jamashita/anden-type';
import { Heisenberg, Matter, Nihil } from '@jamashita/genitore-heisenberg';
import { Epoque } from './Epoque';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { IUnscharferelation, UReturnType } from './IUnscharferelation';
import { UnscharferelationInternal } from './UnscharferelationInternal';

export class Unscharferelation<P> implements IUnscharferelation<P> {
  private readonly internal: IUnscharferelation<P>;

  public static absent<P>(value: SyncAsync<Nihil>): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<P>) => {
      if (Kind.isUndefined(value) || Kind.isNull(value)) {
        return epoque.decline();
      }
      if (Kind.isPromiseLike<Nihil>(value)) {
        return value.then<unknown, unknown>(
          () => {
            return epoque.decline();
          },
          (e: unknown) => {
            return epoque.throw(e);
          }
        );
      }

      return epoque.throw(new UnscharferelationError('IMPOSSIBLE'));
    });
  }

  public static all<P>(unscharferelations: Iterable<Unscharferelation<P>>): Unscharferelation<Array<P>> {
    const us: Array<Unscharferelation<P>> = [...unscharferelations];

    if (us.length === 0) {
      return Unscharferelation.present<Array<P>>([]);
    }

    const promises: Array<Promise<Heisenberg<P>>> = us.map<Promise<Heisenberg<P>>>((u: Unscharferelation<P>) => {
      return u.terminate();
    });

    return Unscharferelation.of<Array<P>>((epoque: Epoque<Array<P>>) => {
      return Promise.all<Heisenberg<P>>(promises).then<unknown, unknown>(
        (heisenbergs: Array<Heisenberg<P>>) => {
          const arr: Array<P> = [];
          let absent: boolean = false;

          for (const heisenberg of heisenbergs) {
            if (heisenberg.isLost()) {
              return epoque.throw(heisenberg.getCause());
            }
            if (heisenberg.isPresent()) {
              arr.push(heisenberg.get());

              continue;
            }
            if (heisenberg.isAbsent()) {
              absent = true;
            }
          }

          if (absent) {
            return epoque.decline();
          }

          return epoque.accept(arr);
        }
      );
    });
  }

  public static anyway<P>(unscharferelations: Iterable<Unscharferelation<P>>): Promise<Array<Heisenberg<P>>> {
    const promises: Array<Promise<Heisenberg<P>>> = [...unscharferelations].map<Promise<Heisenberg<P>>>((u: Unscharferelation<P>) => {
      return u.terminate();
    });

    return Promise.all<Heisenberg<P>>(promises);
  }

  public static maybe<P>(value: SyncAsync<Suspicious<Matter<P>>>): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<P>) => {
      if (Kind.isUndefined(value) || Kind.isNull(value)) {
        return epoque.decline();
      }
      if (Kind.isPromiseLike<Suspicious<Matter<P>>>(value)) {
        return value.then<unknown, unknown>(
          (v: Suspicious<Matter<P>>) => {
            if (Kind.isUndefined(v) || Kind.isNull(v)) {
              return epoque.decline();
            }

            return epoque.accept(v);
          },
          () => {
            return epoque.throw(new UnscharferelationError('REJECTED'));
          }
        );
      }

      return epoque.accept(value);
    });
  }

  public static of<P>(func: UnaryFunction<Epoque<P>, unknown>): Unscharferelation<P> {
    return Unscharferelation.ofUnscharferelation<P>(UnscharferelationInternal.of<P>(func));
  }

  public static ofHeisenberg<P>(heisenberg: Heisenberg<P>): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<P>) => {
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

  public static ofUnscharferelation<P>(unscharferelation: IUnscharferelation<P>): Unscharferelation<P> {
    return new Unscharferelation<P>(unscharferelation);
  }

  public static present<P>(value: SyncAsync<Matter<P>>): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<P>) => {
      if (Kind.isUndefined(value) || Kind.isNull(value)) {
        return epoque.throw(new UnscharferelationError('IMPOSSIBLE'));
      }
      if (Kind.isPromiseLike<Matter<P>>(value)) {
        return value.then<unknown, unknown>(
          (v: Matter<P>) => {
            return epoque.accept(v);
          },
          (e: unknown) => {
            return epoque.throw(e);
          }
        );
      }

      return epoque.accept(value);
    });
  }

  protected constructor(internal: IUnscharferelation<P>) {
    this.internal = internal;
  }

  public get(): Promise<Matter<P>> {
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

  public ifPresent(consumer: Consumer<Matter<P>>): this {
    this.internal.ifPresent(consumer);

    return this;
  }

  public map<Q = P>(mapper: UnaryFunction<Matter<P>, UReturnType<Q>>): Unscharferelation<Q> {
    return Unscharferelation.ofUnscharferelation<Q>(this.internal.map<Q>(mapper));
  }

  public pass(accepted: Consumer<Matter<P>>, declined: Consumer<void>, thrown: Consumer<unknown>): this {
    this.internal.pass(accepted, declined, thrown);

    return this;
  }

  public peek(peek: Peek): this {
    this.internal.peek(peek);

    return this;
  }

  public recover<Q = P>(mapper: Supplier<UReturnType<Q>>): Unscharferelation<P | Q> {
    return Unscharferelation.ofUnscharferelation<P | Q>(this.internal.recover<Q>(mapper));
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
