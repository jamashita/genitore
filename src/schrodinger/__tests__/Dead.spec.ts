import { MockRuntimeError } from '@jamashita/anden/error';
import { Dead } from '../Dead.js';
import type { Schrodinger } from '../Schrodinger.js';

describe('Dead', () => {
  describe('get', () => {
    it('throws the inner error', () => {
      const error = new MockRuntimeError('');

      const dead = Dead.of(error);

      expect(() => {
        dead.get();
      }).toThrow(error);
    });
  });

  describe('getError', () => {
    it('returns thrown error', () => {
      const error = new MockRuntimeError('');
      const dead = Dead.of(error);

      expect(dead.getError()).toBe(error);
    });
  });

  describe('getState', () => {
    it('returns DEAD', () => {
      expect(Dead.of(new Error()).getState()).toBe('DEAD');
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      const error = new MockRuntimeError('');

      const fn = vi.fn();

      const dead: Schrodinger<number, MockRuntimeError> = Dead.of(error);

      dead.ifAlive(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      const error = new MockRuntimeError('');

      const fn = vi.fn();

      const dead: Schrodinger<number, MockRuntimeError> = Dead.of(error);

      dead.ifContradiction(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifDead', () => {
    it('will be invoked', () => {
      const error = new MockRuntimeError('');

      const fn = vi.fn();

      const dead: Schrodinger<number, MockRuntimeError> = Dead.of(error);

      dead.ifDead((e: MockRuntimeError) => {
        fn();
        expect(e).toBe(error);
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const dead1 = Dead.of(new MockRuntimeError(''));
      const dead2 = Dead.of(new MockRuntimeError(''));

      expect(dead1.isAlive()).toBe(false);
      expect(dead2.isAlive()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      const dead1 = Dead.of(new MockRuntimeError(''));
      const dead2 = Dead.of(new MockRuntimeError(''));

      expect(dead1.isContradiction()).toBe(false);
      expect(dead2.isContradiction()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns true', () => {
      const dead1 = Dead.of(new MockRuntimeError(''));
      const dead2 = Dead.of(new MockRuntimeError(''));

      expect(dead1.isDead()).toBe(true);
      expect(dead2.isDead()).toBe(true);
    });
  });
});
