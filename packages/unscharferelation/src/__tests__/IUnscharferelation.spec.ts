import { Epoque } from '../Epoque/Interface/Epoque';
import { isUnscharferelation } from '../Interface/IUnscharferelation';
import { Unscharferelation } from '../Unscharferelation';
import { UnscharferelationInternal } from '../UnscharferelationInternal';

describe('IUnscharferelation', () => {
  describe('isUnscharferelation', () => {
    it('returns true if IUnscharferelation methods the given object have', () => {
      expect.assertions(25);

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.present<number>(4);
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
          filter() {
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
          filter() {
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
          filter() {
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
          filter() {
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
          filter() {
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
          filter() {
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
          filter() {
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
          filter() {
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
