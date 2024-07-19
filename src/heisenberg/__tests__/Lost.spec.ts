import { MockRuntimeError } from '@jamashita/anden/error';
import type { Heisenberg } from '../Heisenberg.js';
import { Lost } from '../Lost.js';

describe('Lost', () => {
  describe('get', () => {
    it('throws given error', () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const lost1 = Lost.of<void>(error1);
      const lost2 = Lost.of<number>(error2);

      expect(() => {
        lost1.get();
      }).toThrow(error1);
      expect(() => {
        lost2.get();
      }).toThrow(error2);
    });
  });

  describe('getCause', () => {
    it('returns thrown error', () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const lost1 = Lost.of<void>(error1);
      const lost2 = Lost.of<number>(error2);

      expect(lost1.getCause()).toBe(error1);
      expect(lost2.getCause()).toBe(error2);
    });
  });

  describe('getState', () => {
    it('returns LOST', () => {
      expect(Lost.of('').getState()).toBe('LOST');
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      const error = new MockRuntimeError('');

      const fn = vi.fn();

      const lost: Heisenberg<number> = Lost.of(error);

      lost.ifAbsent(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifLost', () => {
    it('will be invoked', () => {
      const error = new MockRuntimeError('');

      const fn = vi.fn();

      const lost: Heisenberg<number> = Lost.of(error);

      lost.ifLost(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      const error = new MockRuntimeError('');

      const fn = vi.fn();

      const lost: Heisenberg<number> = Lost.of(error);

      lost.ifPresent(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('isAbsent', () => {
    it('always returns false', () => {
      const error = new MockRuntimeError('');
      const lost = Lost.of<void>(error);

      expect(lost.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('always returns true', () => {
      const error = new MockRuntimeError('');
      const lost = Lost.of<void>(error);

      expect(lost.isLost()).toBe(true);
    });
  });

  describe('isPresent', () => {
    it('always returns false', () => {
      const error = new MockRuntimeError('');
      const lost = Lost.of<void>(error);

      expect(lost.isPresent()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Lost and its retaining cause', () => {
      expect(Lost.of(null).toString()).toBe('Lost: null');
    });
  });
});
