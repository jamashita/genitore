import { MockRuntimeError } from '@jamashita/anden/error';
import { Contradiction } from '../Contradiction.js';
import type { Schrodinger } from '../Schrodinger.js';

describe('Contradiction', () => {
  describe('get', () => {
    it('throws given error', () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const contradiction1 = Contradiction.of(error1);
      const contradiction2 = Contradiction.of(error2);

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
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const contradiction1 = Contradiction.of(error1);
      const contradiction2 = Contradiction.of(error2);

      expect(contradiction1.getCause()).toBe(error1);
      expect(contradiction2.getCause()).toBe(error2);
    });
  });

  describe('getState', () => {
    it('returns CONTRADICTION', () => {
      expect(Contradiction.of('').getState()).toBe('CONTRADICTION');
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      const value = 1;

      const fn = vi.fn();

      const contradiction: Schrodinger<number, MockRuntimeError> = Contradiction.of(value);

      contradiction.ifAlive(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifContradiction', () => {
    it('will be invoked', () => {
      const value = 1;

      const fn = vi.fn();

      const contradiction: Schrodinger<number, MockRuntimeError> = Contradiction.of(value);

      contradiction.ifContradiction((v: unknown) => {
        fn();
        expect(v).toBe(value);
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      const value = 1;

      const fn = vi.fn();

      const contradiction: Schrodinger<number, MockRuntimeError> = Contradiction.of(value);

      contradiction.ifDead(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const error = new MockRuntimeError('');
      const contradiction = Contradiction.of(error);

      expect(contradiction.isAlive()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns true', () => {
      const error = new MockRuntimeError('');
      const contradiction = Contradiction.of(error);

      expect(contradiction.isContradiction()).toBe(true);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const error = new MockRuntimeError('');
      const contradiction = Contradiction.of(error);

      expect(contradiction.isDead()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Contradiction and its retaining cause', () => {
      expect(Contradiction.of(null).toString()).toBe('Contradiction: null');
    });
  });
});
