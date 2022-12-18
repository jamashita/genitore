import { Consumer, Serializable } from '@jamashita/anden-type';
import { Absent } from './Absent';
import { Lost } from './Lost';
import { Present } from './Present';

export type HeisenbergState = 'ABSENT' | 'LOST' | 'PRESENT' | 'UNCERTAIN';

export interface Heisenberg<out P> extends Serializable {
  get(): Exclude<P, null | undefined | void>;

  getState(): HeisenbergState;

  ifAbsent(consumer: Consumer<void>): void;

  ifLost(consumer: Consumer<unknown>): void;

  ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): void;

  isAbsent(): this is Absent<P>;

  isLost(): this is Lost<P>;

  isPresent(): this is Present<P>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
