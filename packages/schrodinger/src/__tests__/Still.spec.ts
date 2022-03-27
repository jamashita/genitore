import { MockRuntimeError } from '@jamashita/anden-error';
import { Schrodinger } from '../Schrodinger';
import { SchrodingerError } from '../SchrodingerError';
import { Still } from '../Still';

describe('Still', () => {
  describe('get', () => {
    it('throws SchrodingerError', () => {
      const still: Still<number, MockRuntimeError> = Still.of();

      expect(() => {
        still.get();
      }).toThrow(SchrodingerError);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const still: Still<number, MockRuntimeError> = Still.of();

      expect(still.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const still: Still<number, MockRuntimeError> = Still.of();

      expect(still.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      const still: Still<number, MockRuntimeError> = Still.of();

      expect(still.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      const fn: jest.Mock = jest.fn();

      const still: Schrodinger<number, MockRuntimeError> = Still.of();

      still.ifAlive(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      const fn: jest.Mock = jest.fn();

      const still: Schrodinger<number, MockRuntimeError> = Still.of();

      still.ifDead(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      const fn: jest.Mock = jest.fn();

      const still: Schrodinger<number, MockRuntimeError> = Still.of();

      still.ifContradiction(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('toString', () => {
    it('returns Still', () => {
      expect(Still.of().toString()).toBe('Still');
    });
  });
});
