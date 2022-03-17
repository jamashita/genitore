import { MockRuntimeError } from '@jamashita/anden-error';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import { Chrono } from '../Chrono';
import { containsError, isSuperposition } from '../ISuperposition';
import { Superposition } from '../Superposition';
import { SuperpositionInternal } from '../SuperpositionInternal';

describe('ISuperposition', () => {
  describe('isSuperposition', () => {
    it('returns true if ISuperposition methods the given object have', () => {
      const superposition1: Superposition<number, MockRuntimeError> = Superposition.alive(4);
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(new MockRuntimeError());
        },
        []
      );

      expect(isSuperposition(null)).toBe(false);
      expect(isSuperposition(undefined)).toBe(false);
      expect(isSuperposition('')).toBe(false);
      expect(isSuperposition('123')).toBe(false);
      expect(isSuperposition('abcd')).toBe(false);
      expect(isSuperposition(123)).toBe(false);
      expect(isSuperposition(0)).toBe(false);
      expect(isSuperposition(false)).toBe(false);
      expect(isSuperposition(true)).toBe(false);
      expect(isSuperposition(Symbol())).toBe(false);
      expect(isSuperposition(20n)).toBe(false);
      expect(isSuperposition({})).toBe(false);
      expect(isSuperposition([])).toBe(false);
      expect(
        isSuperposition({
          get() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
            // NOOP
          },
          terminate() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
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
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
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
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
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
          transform() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
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
          transform() {
            // NOOP
          },
          ifAlive() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
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
          transform() {
            // NOOP
          },
          ifAlive() {
            // NOOP
          },
          ifDead() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
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
          transform() {
            // NOOP
          },
          ifAlive() {
            // NOOP
          },
          ifDead() {
            // NOOP
          },
          ifContradiction() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
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
          transform() {
            // NOOP
          },
          ifAlive() {
            // NOOP
          },
          ifDead() {
            // NOOP
          },
          ifContradiction() {
            // NOOP
          },
          pass() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition({
          get() {
            // NOOP
          },
          getErrors() {
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
          transform() {
            // NOOP
          },
          ifAlive() {
            // NOOP
          },
          ifDead() {
            // NOOP
          },
          ifContradiction() {
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
      expect(isSuperposition(superposition1)).toBe(true);
      expect(isSuperposition(superposition2)).toBe(true);
    });
  });

  describe('containsError', () => {
    it('returns true if the very class is included', () => {
      const error: MockRuntimeError = new MockRuntimeError();

      expect(containsError<Error>(error, new Set<DeadConstructor>([TypeError, SyntaxError, MockRuntimeError]))).toBe(true);
    });

    it('returns false if the class is not included', () => {
      const error: MockRuntimeError = new MockRuntimeError();

      expect(containsError<Error>(error, new Set<DeadConstructor>([TypeError, SyntaxError]))).toBe(false);
    });

    it('returns true if super class of the class is included', () => {
      const error: MockRuntimeError = new MockRuntimeError();

      expect(containsError<Error>(error, new Set<DeadConstructor>([TypeError, SyntaxError, Error]))).toBe(true);
    });
  });
});
