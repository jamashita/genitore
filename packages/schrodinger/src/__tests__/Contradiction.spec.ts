import { MockRuntimeError } from '@jamashita/anden-error';
import { Contradiction } from '../Contradiction';
import { Schrodinger } from '../Schrodinger';

describe('Contradiction', () => {
  describe('get', () => {
    it('throws given error', () => {
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const contradiction1: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error1);
      const contradiction2: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error2);

      expect(() => {
        contradiction1.get();
      }).toThrow(error1);
      expect(() => {
        contradiction2.get();
      }).toThrow(error2);
    });
  });

  describe('getCause', () => {
    it('returns thrown error', () => {
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const contradiction1: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error1);
      const contradiction2: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error2);

      expect(contradiction1.getCause()).toBe(error1);
      expect(contradiction2.getCause()).toBe(error2);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const error: MockRuntimeError = new MockRuntimeError();
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error);

      expect(contradiction.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const error: MockRuntimeError = new MockRuntimeError();
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error);

      expect(contradiction.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns true', () => {
      const error: MockRuntimeError = new MockRuntimeError();
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error);

      expect(contradiction.isContradiction()).toBe(true);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      const value: number = 1;

      const fn: jest.Mock = jest.fn();

      const contradiction: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(value);

      contradiction.ifAlive(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      const value: number = 1;

      const fn: jest.Mock = jest.fn();

      const contradiction: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(value);

      contradiction.ifDead(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifContradiction', () => {
    it('will be invoked', () => {
      const value: number = 1;

      const fn: jest.Mock = jest.fn();

      const contradiction: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(value);

      contradiction.ifContradiction((v: unknown) => {
        fn();
        expect(v).toBe(value);
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('toString', () => {
    it('returns Contradiction and its retaining cause', () => {
      expect(Contradiction.of<number, MockRuntimeError>(null).toString()).toBe('Contradiction: null');
    });
  });
});
