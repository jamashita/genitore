import type { Consumer, Serializable } from '@jamashita/anden/type';
import { Absent } from './Absent.js';
import { Lost } from './Lost.js';
import { Present } from './Present.js';

export type HeisenbergState = 'ABSENT' | 'LOST' | 'PRESENT' | 'UNCERTAIN';

export interface Heisenberg<out P> extends Serializable {
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  get(): Exclude<P, null | undefined | void>;

  getState(): HeisenbergState;

  ifAbsent(consumer: Consumer<void>): this;

  ifLost(consumer: Consumer<unknown>): this;

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  ifPresent(consumer: Consumer<Exclude<P, null | undefined | void>>): this;

  isAbsent(): this is Absent<P>;

  isLost(): this is Lost<P>;

  isPresent(): this is Present<P>;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: <explanation>
export class Heisenberg<out P> {
  public static all<P>(heisenbergs: Iterable<Heisenberg<P>>): Heisenberg<Array<P>> {
    const hs = [...heisenbergs];
    const arr: Array<P> = [];
    let absent = false;

    for (const h of hs) {
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
          const lost = h as Lost<P>;

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
