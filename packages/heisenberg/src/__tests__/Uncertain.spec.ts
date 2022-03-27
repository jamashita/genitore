import { Heisenberg } from '../Heisenberg';
import { HeisenbergError } from '../HeisenbergError';
import { Uncertain } from '../Uncertain';

describe('Uncertain', () => {
  describe('get', () => {
    it('throws HeisenbergError', () => {
      const uncertain: Uncertain<number> = Uncertain.of();

      expect(() => {
        uncertain.get();
      }).toThrow(HeisenbergError);
    });
  });

  describe('isPresent', () => {
    it('always returns false', () => {
      const uncertain: Uncertain<number> = Uncertain.of();

      expect(uncertain.isPresent()).toBe(false);
    });
  });

  describe('isAbsent', () => {
    it('always returns false', () => {
      const uncertain: Uncertain<number> = Uncertain.of();

      expect(uncertain.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('always returns false', () => {
      const uncertain: Uncertain<number> = Uncertain.of();

      expect(uncertain.isLost()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      const fn: jest.Mock = jest.fn();

      const uncertain: Heisenberg<number> = Uncertain.of();

      uncertain.ifPresent(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      const fn: jest.Mock = jest.fn();

      const uncertain: Heisenberg<number> = Uncertain.of();

      uncertain.ifAbsent(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      const fn: jest.Mock = jest.fn();

      const uncertain: Heisenberg<number> = Uncertain.of();

      uncertain.ifLost(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('toString', () => {
    it('returns Uncertain', () => {
      expect(Uncertain.of().toString()).toBe('Uncertain');
    });
  });
});
