import type { MockRuntimeError } from '@jamashita/anden/error';
import { Alive } from '../Alive.js';
import type { Schrodinger } from '../Schrodinger.js';

describe('Alive', () => {
  describe('get', () => {
    it('returns the inner value', () => {
      const alive1: Alive<number, MockRuntimeError> = Alive.of(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of(false);

      expect(alive1.get()).toBe(1);
      expect(alive2.get()).toBe(0);
      expect(alive3.get()).toBe(-1);
      expect(alive4.get()).toBe('');
      expect(alive5.get()).toBe('1');
      expect(alive6.get()).toBe(true);
      expect(alive7.get()).toBe(false);
    });
  });

  describe('getState', () => {
    it('returns ALIVE', () => {
      expect(Alive.of('').getState()).toBe('ALIVE');
    });
  });

  describe('ifAlive', () => {
    it('will be invoked', () => {
      const value = 1;

      const fn = vi.fn();

      const alive: Schrodinger<number, MockRuntimeError> = Alive.of(value);

      alive.ifAlive((v: number) => {
        fn();
        expect(v).toBe(value);
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      const value = 1;

      const fn = vi.fn();

      const alive: Schrodinger<number, MockRuntimeError> = Alive.of(value);

      alive.ifContradiction(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      const value = 1;

      const fn = vi.fn();

      const alive: Schrodinger<number, MockRuntimeError> = Alive.of(value);

      alive.ifDead(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('isAlive', () => {
    it('always returns true', () => {
      const alive1: Alive<number, MockRuntimeError> = Alive.of(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of(false);

      expect(alive1.isAlive()).toBe(true);
      expect(alive2.isAlive()).toBe(true);
      expect(alive3.isAlive()).toBe(true);
      expect(alive4.isAlive()).toBe(true);
      expect(alive5.isAlive()).toBe(true);
      expect(alive6.isAlive()).toBe(true);
      expect(alive7.isAlive()).toBe(true);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      const alive1: Alive<number, MockRuntimeError> = Alive.of(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of(false);

      expect(alive1.isContradiction()).toBe(false);
      expect(alive2.isContradiction()).toBe(false);
      expect(alive3.isContradiction()).toBe(false);
      expect(alive4.isContradiction()).toBe(false);
      expect(alive5.isContradiction()).toBe(false);
      expect(alive6.isContradiction()).toBe(false);
      expect(alive7.isContradiction()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const alive1: Alive<number, MockRuntimeError> = Alive.of(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of(false);

      expect(alive1.isDead()).toBe(false);
      expect(alive2.isDead()).toBe(false);
      expect(alive3.isDead()).toBe(false);
      expect(alive4.isDead()).toBe(false);
      expect(alive5.isDead()).toBe(false);
      expect(alive6.isDead()).toBe(false);
      expect(alive7.isDead()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Alive and its retaining value', () => {
      expect(Alive.of(true).toString()).toBe('Alive: true');
    });
  });
});
