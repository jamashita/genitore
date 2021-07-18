import { Consumer, Kind, Peek, Supplier, Suspicious, SyncAsync, UnaryFunction } from '@jamashita/anden-type';
import { Heisenberg, Matter, Nihil } from '@jamashita/genitore-heisenberg';
import { Epoque } from './Epoque.js';
import { UnscharferelationError } from './Error/UnscharferelationError.js';
import { IUnscharferelation, UReturnType } from './IUnscharferelation.js';
import { UnscharferelationInternal } from './UnscharferelationInternal.js';

export class Unscharferelation<P> implements IUnscharferelation<P, 'Unscharferelation'> {
  public readonly noun: 'Unscharferelation' = 'Unscharferelation';
  private readonly internal: IUnscharferelation<P>;

  public static absent<PT>(value: SyncAsync<Nihil>): Unscharferelation<PT> {
    return Unscharferelation.of<PT>((epoque: Epoque<PT>) => {
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

  public static all<PT>(unscharferelations: Iterable<Unscharferelation<PT>>): Unscharferelation<Array<PT>> {
    const us: Array<Unscharferelation<PT>> = [...unscharferelations];

    if (us.length === 0) {
      return Unscharferelation.present<Array<PT>>([]);
    }

    const promises: Array<Promise<Heisenberg<PT>>> = us.map<Promise<Heisenberg<PT>>>((u: Unscharferelation<PT>) => {
      return u.terminate();
    });

    return Unscharferelation.of<Array<PT>>((epoque: Epoque<Array<PT>>) => {
      return Promise.all<Heisenberg<PT>>(promises).then<unknown, unknown>(
        (heisenbergs: Array<Heisenberg<PT>>) => {
          const arr: Array<PT> = [];
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

  public static anyway<PT>(unscharferelations: Iterable<Unscharferelation<PT>>): Promise<Array<Heisenberg<PT>>> {
    const promises: Array<Promise<Heisenberg<PT>>> = [...unscharferelations].map<Promise<Heisenberg<PT>>>((u: Unscharferelation<PT>) => {
      return u.terminate();
    });

    return Promise.all<Heisenberg<PT>>(promises);
  }

  public static maybe<PT>(value: SyncAsync<Suspicious<Matter<PT>>>): Unscharferelation<PT> {
    return Unscharferelation.of<PT>((epoque: Epoque<PT>) => {
      if (Kind.isUndefined(value) || Kind.isNull(value)) {
        return epoque.decline();
      }
      if (Kind.isPromiseLike<Suspicious<Matter<PT>>>(value)) {
        return value.then<unknown, unknown>(
          (v: Suspicious<Matter<PT>>) => {
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

  public static of<PT>(func: UnaryFunction<Epoque<PT>, unknown>): Unscharferelation<PT> {
    return Unscharferelation.ofUnscharferelation<PT>(UnscharferelationInternal.of<PT>(func));
  }

  public static ofHeisenberg<PT>(heisenberg: Heisenberg<PT>): Unscharferelation<PT> {
    return Unscharferelation.of<PT>((epoque: Epoque<PT>) => {
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

  public static ofUnscharferelation<PT>(unscharferelation: IUnscharferelation<PT>): Unscharferelation<PT> {
    return new Unscharferelation<PT>(unscharferelation);
  }

  public static present<PT>(value: SyncAsync<Matter<PT>>): Unscharferelation<PT> {
    return Unscharferelation.of<PT>((epoque: Epoque<PT>) => {
      if (Kind.isUndefined(value) || Kind.isNull(value)) {
        return epoque.throw(new UnscharferelationError('IMPOSSIBLE'));
      }
      if (Kind.isPromiseLike<Matter<PT>>(value)) {
        return value.then<unknown, unknown>(
          (v: Matter<PT>) => {
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
