import { type Consumer, Kind, type Nullable, type Serializable } from '@jamashita/anden/type';
import { Alive } from './Alive.js';
import { Contradiction } from './Contradiction.js';
import { Dead } from './Dead.js';

export type SchrodingerState = 'ALIVE' | 'CONTRADICTION' | 'DEAD' | 'STILL';

export interface Schrodinger<out A, out D> extends Serializable {
  get(): A;

  getState(): SchrodingerState;

  ifAlive(consumer: Consumer<A>): this;

  ifContradiction(consumer: Consumer<unknown>): this;

  ifDead(consumer: Consumer<D>): this;

  isAlive(): this is Alive<A, D>;

  isContradiction(): this is Contradiction<A, D>;

  isDead(): this is Dead<A, D>;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: <explanation>
export class Schrodinger<out A, out D> {
  public static all<A, D>(schrodingers: Iterable<Schrodinger<A, D>>): Schrodinger<Array<A>, D> {
    const ss = [...schrodingers];
    const arr: Array<A> = [];
    let err: Nullable<D> = null;

    for (const s of ss) {
      switch (s.getState()) {
        case 'ALIVE': {
          arr.push(s.get());

          break;
        }
        case 'DEAD': {
          if (Kind.isNull(err)) {
            const dead = s as Dead<A, D>;

            err = dead.getError();
          }

          break;
        }
        case 'CONTRADICTION': {
          const contradiction = s as Contradiction<A, D>;

          return Contradiction.of(contradiction.getCause());
        }
        default: {
          // NOOP
        }
      }
    }

    if (!Kind.isNull(err)) {
      return Dead.of(err);
    }

    return Alive.of(arr);
  }
}
