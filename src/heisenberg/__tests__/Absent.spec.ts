import { Absent } from '../Absent.js';
import type { Heisenberg } from '../Heisenberg.js';
import { HeisenbergError } from '../HeisenbergError.js';

describe('Absent', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      const absent = Absent.of<number>();

      expect(() => {
        absent.get();
      }).toThrow(HeisenbergError);
    });
  });

  describe('getState', () => {
    it('returns ABSENT', () => {
      expect(Absent.of().getState()).toBe('ABSENT');
    });
  });

  describe('ifAbsent', () => {
    it('will be invoked', () => {
      const fn = vi.fn();

      const absent: Heisenberg<number> = Absent.of();

      absent.ifAbsent(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      const fn = vi.fn();

      const absent: Heisenberg<number> = Absent.of();

      absent.ifLost(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      const fn = vi.fn();

      const absent: Heisenberg<number> = Absent.of();

      absent.ifPresent(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('isAbsent', () => {
    it('always returns true', () => {
      const absent1 = Absent.of<void>();
      const absent2 = Absent.of<number>();

      expect(absent1.isAbsent()).toBe(true);
      expect(absent2.isAbsent()).toBe(true);
    });
  });

  describe('isLost', () => {
    it('always returns false', () => {
      const absent1 = Absent.of<void>();
      const absent2 = Absent.of<number>();

      expect(absent1.isLost()).toBe(false);
      expect(absent2.isLost()).toBe(false);
    });
  });

  describe('isPresent', () => {
    it('always returns false', () => {
      const absent1 = Absent.of<void>();
      const absent2 = Absent.of<number>();

      expect(absent1.isPresent()).toBe(false);
      expect(absent2.isPresent()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Absent', () => {
      expect(Absent.of().toString()).toBe('Absent');
    });
  });
});
