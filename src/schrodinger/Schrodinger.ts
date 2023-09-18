import { Consumer, Kind, Nullable, Serializable } from '@jamashita/anden/type';
import { Alive } from './Alive.js';
import { Contradiction } from './Contradiction.js';
import { Dead } from './Dead.js';

export type SchrodingerState = 'ALIVE' | 'CONTRADICTION' | 'DEAD' | 'STILL';

export interface Schrodinger<out A, out D extends Error> extends Serializable {
  get(): Exclude<A, Error>;

  getState(): SchrodingerState;

  ifAlive(consumer: Consumer<Exclude<A, Error>>): this;

  ifContradiction(consumer: Consumer<unknown>): this;

  ifDead(consumer: Consumer<D>): this;

  isAlive(): this is Alive<A, D>;

  isContradiction(): this is Contradiction<A, D>;

  isDead(): this is Dead<A, D>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-declaration-merging
export class Schrodinger<out A, out D extends Error> {
  public static all<A, D extends Error>(schrodingers: Iterable<Schrodinger<A, D>>): Schrodinger<Array<A>, D> {
    const ss: Array<Schrodinger<A, D>> = [...schrodingers];

    if (ss.length === 0) {
      return Alive.of([]);
    }

    const arr: Array<A> = [];
    let err: Nullable<D> = null;

    for (const s of schrodingers) {
      switch (s.getState()) {
        case 'ALIVE': {
          arr.push(s.get());

          break;
        }
        case 'DEAD': {
          if (Kind.isNull(err)) {
            const dead: Dead<A, D> = s as Dead<A, D>;

            err = dead.getError();
          }

          break;
        }
        case 'CONTRADICTION': {
          const contradiction: Contradiction<A, D> = s as Contradiction<A, D>;

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
