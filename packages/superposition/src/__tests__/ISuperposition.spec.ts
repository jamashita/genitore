import { MockRuntimeError } from '@jamashita/anden-error';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import { Chrono } from '../Chrono.js';
import { containsError, isSuperposition } from '../ISuperposition.js';
import { Superposition } from '../Superposition.js';
import { SuperpositionInternal } from '../SuperpositionInternal.js';

describe('ISuperposition', () => {
  describe('isSuperposition', () => {
    it('returns true if ISuperposition methods the given object have', () => {
      expect.assertions(26);

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(4);
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(new MockRuntimeError());
        },
        []
      );

      expect(isSuperposition<number, MockRuntimeError>(null)).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>(undefined)).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>('')).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>('123')).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>('abcd')).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>(123)).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>(0)).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>(false)).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>(true)).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>(Symbol())).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>(20n)).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>({})).toBe(false);
      expect(isSuperposition<number, MockRuntimeError>([])).toBe(false);
      expect(
        isSuperposition<number, MockRuntimeError>({
          get() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition<number, MockRuntimeError>({
          get() {
            // NOOP
          },
          getErrors() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition<number, MockRuntimeError>({
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
        isSuperposition<number, MockRuntimeError>({
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
        isSuperposition<number, MockRuntimeError>({
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
        isSuperposition<number, MockRuntimeError>({
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
        isSuperposition<number, MockRuntimeError>({
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
        isSuperposition<number, MockRuntimeError>({
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
        isSuperposition<number, MockRuntimeError>({
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
        isSuperposition<number, MockRuntimeError>({
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
        isSuperposition<number, MockRuntimeError>({
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
      expect(isSuperposition<number, MockRuntimeError>(superposition1)).toBe(true);
      expect(isSuperposition<number, MockRuntimeError>(superposition2)).toBe(true);
    });
  });

  describe('containsError', () => {
    it('returns true if the very class is included', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      expect(containsError<Error>(error, new Set<DeadConstructor>([TypeError, SyntaxError, MockRuntimeError]))).toBe(true);
    });

    it('returns false if the class is not included', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      expect(containsError<Error>(error, new Set<DeadConstructor>([TypeError, SyntaxError]))).toBe(false);
    });

    it('returns true if super class of the class is included', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      expect(containsError<Error>(error, new Set<DeadConstructor>([TypeError, SyntaxError, Error]))).toBe(true);
    });
  });
});
