import { Absent } from '../Absent';
import { HeisenbergError } from '../Error/HeisenbergError';
import { Heisenberg } from '../Heisenberg';

describe('Absent', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      const absent: Absent<number> = Absent.of<number>();

      expect(() => {
        absent.get();
      }).toThrow(HeisenbergError);
    });
  });

  describe('isPresent', () => {
    it('always returns false', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isPresent()).toBe(false);
      expect(absent2.isPresent()).toBe(false);
    });
  });

  describe('isAbsent', () => {
    it('always returns true', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isAbsent()).toBe(true);
      expect(absent2.isAbsent()).toBe(true);
    });
  });

  describe('isLost', () => {
    it('always returns false', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isLost()).toBe(false);
      expect(absent2.isLost()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      const fn: jest.Mock = jest.fn();

      const absent: Heisenberg<number> = Absent.of<number>();

      absent.ifPresent(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifAbsent', () => {
    it('will be invoked', () => {
      const fn: jest.Mock = jest.fn();

      const absent: Heisenberg<number> = Absent.of<number>();

      absent.ifAbsent(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      const fn: jest.Mock = jest.fn();

      const absent: Heisenberg<number> = Absent.of<number>();

      absent.ifLost(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('toString', () => {
    it('returns Absent', () => {
      expect(Absent.of<number>().toString()).toBe('Absent');
    });
  });
});
