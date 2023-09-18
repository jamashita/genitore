import { Consumer, Serializable } from '@jamashita/anden/type';
import { Absent } from './Absent.js';
import { Lost } from './Lost.js';
import { Present } from './Present.js';

export type HeisenbergState = 'ABSENT' | 'LOST' | 'PRESENT' | 'UNCERTAIN';

export interface Heisenberg<out P> extends Serializable {
  get(): Exclude<P, null | undefined | void>;

  getState(): HeisenbergState;

  ifAbsent(consumer: Consumer<void>): this;

  ifLost(consumer: Consumer<unknown>): this;

  ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this;

  isAbsent(): this is Absent<P>;

  isLost(): this is Lost<P>;

  isPresent(): this is Present<P>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-declaration-merging
export class Heisenberg<out P> {
  public static all<P>(heisenbergs: Iterable<Heisenberg<P>>): Heisenberg<Array<P>> {
    const hs: Array<Heisenberg<P>> = [...heisenbergs];

    if (hs.length === 0) {
      return Present.of([]);
    }

    const arr: Array<P> = [];
    let absent: boolean = false;

    for (const h of heisenbergs) {
      switch (h.getState()) {
        case 'PRESENT': {
          arr.push(h.get());

          break;
        }
        case 'ABSENT': {
          absent = true;

          break;
        }
        case 'LOST': {
          const lost: Lost<P> = h as Lost<P>;

          return Lost.of(lost.getCause());
        }
        default: {
          // NOOP
        }
      }
    }

    if (absent) {
      return Absent.of();
    }

    return Present.of(arr);
  }
}
