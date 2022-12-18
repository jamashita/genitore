import { Present } from '../../heisenberg/index.js';
import { Epoque } from '../Epoque.js';
import { isUnscharferelation } from '../IUnscharferelation.js';
import { Unscharferelation } from '../Unscharferelation.js';
import { UnscharferelationInternal } from '../UnscharferelationInternal.js';

describe('IUnscharferelation', () => {
  describe('isUnscharferelation', () => {
    it('returns true if IUnscharferelation methods the given object have', () => {
      const unscharferelation1: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of(4));
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      expect(isUnscharferelation<number>(null)).toBe(false);
      expect(isUnscharferelation<number>(undefined)).toBe(false);
      expect(isUnscharferelation<number>('')).toBe(false);
      expect(isUnscharferelation<number>('123')).toBe(false);
      expect(isUnscharferelation<number>('abcd')).toBe(false);
      expect(isUnscharferelation<number>(123)).toBe(false);
      expect(isUnscharferelation<number>(0)).toBe(false);
      expect(isUnscharferelation<number>(false)).toBe(false);
      expect(isUnscharferelation<number>(true)).toBe(false);
      expect(isUnscharferelation<number>(Symbol())).toBe(false);
      expect(isUnscharferelation<number>(20n)).toBe(false);
      expect(isUnscharferelation<number>({})).toBe(false);
      expect(isUnscharferelation<number>([])).toBe(false);
      expect(
        isUnscharferelation<number>({
          get() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isUnscharferelation<number>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isUnscharferelation<number>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          map() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isUnscharferelation<number>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isUnscharferelation<number>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          },
          ifPresent() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isUnscharferelation<number>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          },
          ifPresent() {
            // NOOP
          },
          ifAbsent() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isUnscharferelation<number>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          },
          ifPresent() {
            // NOOP
          },
          ifAbsent() {
            // NOOP
          },
          ifLost() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isUnscharferelation<number>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          },
          ifPresent() {
            // NOOP
          },
          ifAbsent() {
            // NOOP
          },
          ifLost() {
            // NOOP
          },
          pass() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isUnscharferelation<number>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          },
          ifPresent() {
            // NOOP
          },
          ifAbsent() {
            // NOOP
          },
          ifLost() {
            // NOOP
          },
          pass() {
            // NOOP
          },
          peek() {
            // NOOP
          }
        })
      ).toBe(true);
      expect(isUnscharferelation<number>(unscharferelation1)).toBe(true);
      expect(isUnscharferelation<number>(unscharferelation2)).toBe(true);
    });
  });
});
