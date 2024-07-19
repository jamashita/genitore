import type { Heisenberg } from '../Heisenberg.js';
import { Present } from '../Present.js';

describe('Present', () => {
  describe('get', () => {
    it('returns the inner value', () => {
      const present1 = Present.of(1);
      const present2 = Present.of(0);
      const present3 = Present.of(-1);
      const present4 = Present.of('');
      const present5 = Present.of('1');
      const present6 = Present.of(true);
      const present7 = Present.of(false);

      expect(present1.get()).toBe(1);
      expect(present2.get()).toBe(0);
      expect(present3.get()).toBe(-1);
      expect(present4.get()).toBe('');
      expect(present5.get()).toBe('1');
      expect(present6.get()).toBe(true);
      expect(present7.get()).toBe(false);
    });
  });

  describe('getState', () => {
    it('returns PRESENT', () => {
      expect(Present.of('').getState()).toBe('PRESENT');
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      const value = 1;

      const fn = vi.fn();

      const present: Heisenberg<number> = Present.of(value);

      present.ifAbsent(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      const value = 1;

      const fn = vi.fn();

      const present: Heisenberg<number> = Present.of(value);

      present.ifLost(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifPresent', () => {
    it('will be invoked', () => {
      const value = 1;

      const fn = vi.fn();

      const present: Heisenberg<number> = Present.of(value);

      present.ifPresent((v: number) => {
        fn();
        expect(v).toBe(value);
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('isAbsent', () => {
    it('always returns false', () => {
      const present1 = Present.of(1);
      const present2 = Present.of(0);
      const present3 = Present.of(-1);
      const present4 = Present.of('');
      const present5 = Present.of('1');
      const present6 = Present.of(true);
      const present7 = Present.of(false);

      expect(present1.isAbsent()).toBe(false);
      expect(present2.isAbsent()).toBe(false);
      expect(present3.isAbsent()).toBe(false);
      expect(present4.isAbsent()).toBe(false);
      expect(present5.isAbsent()).toBe(false);
      expect(present6.isAbsent()).toBe(false);
      expect(present7.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('always returns false', () => {
      const present1 = Present.of(1);
      const present2 = Present.of(0);
      const present3 = Present.of(-1);
      const present4 = Present.of('');
      const present5 = Present.of('1');
      const present6 = Present.of(true);
      const present7 = Present.of(false);

      expect(present1.isLost()).toBe(false);
      expect(present2.isLost()).toBe(false);
      expect(present3.isLost()).toBe(false);
      expect(present4.isLost()).toBe(false);
      expect(present5.isLost()).toBe(false);
      expect(present6.isLost()).toBe(false);
      expect(present7.isLost()).toBe(false);
    });
  });

  describe('isPresent', () => {
    it('always returns true', () => {
      const present1 = Present.of(1);
      const present2 = Present.of(0);
      const present3 = Present.of(-1);
      const present4 = Present.of('');
      const present5 = Present.of('1');
      const present6 = Present.of(true);
      const present7 = Present.of(false);

      expect(present1.isPresent()).toBe(true);
      expect(present2.isPresent()).toBe(true);
      expect(present3.isPresent()).toBe(true);
      expect(present4.isPresent()).toBe(true);
      expect(present5.isPresent()).toBe(true);
      expect(present6.isPresent()).toBe(true);
      expect(present7.isPresent()).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns Present and its retaining value', () => {
      expect(Present.of(true).toString()).toBe('Present: true');
    });
  });
});
