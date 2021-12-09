import { MockRuntimeError } from '@jamashita/anden-error';
import { Alive } from '../Alive';
import { Schrodinger } from '../Schrodinger';

describe('Alive', () => {
  describe('get', () => {
    it('returns the inner value', () => {
      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(false);

      expect(alive1.get()).toBe(1);
      expect(alive2.get()).toBe(0);
      expect(alive3.get()).toBe(-1);
      expect(alive4.get()).toBe('');
      expect(alive5.get()).toBe('1');
      expect(alive6.get()).toBe(true);
      expect(alive7.get()).toBe(false);
    });
  });

  describe('isAlive', () => {
    it('always returns true', () => {
      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(false);

      expect(alive1.isAlive()).toBe(true);
      expect(alive2.isAlive()).toBe(true);
      expect(alive3.isAlive()).toBe(true);
      expect(alive4.isAlive()).toBe(true);
      expect(alive5.isAlive()).toBe(true);
      expect(alive6.isAlive()).toBe(true);
      expect(alive7.isAlive()).toBe(true);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(false);

      expect(alive1.isDead()).toBe(false);
      expect(alive2.isDead()).toBe(false);
      expect(alive3.isDead()).toBe(false);
      expect(alive4.isDead()).toBe(false);
      expect(alive5.isDead()).toBe(false);
      expect(alive6.isDead()).toBe(false);
      expect(alive7.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(false);

      expect(alive1.isContradiction()).toBe(false);
      expect(alive2.isContradiction()).toBe(false);
      expect(alive3.isContradiction()).toBe(false);
      expect(alive4.isContradiction()).toBe(false);
      expect(alive5.isContradiction()).toBe(false);
      expect(alive6.isContradiction()).toBe(false);
      expect(alive7.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will be invoked', () => {
      const value: number = 1;

      const fn: jest.Mock = jest.fn();

      const alive: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      alive.ifAlive((v: number) => {
        fn();
        expect(v).toBe(value);
      });

      expect(fn.mock.calls).toHaveLength(1);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      const value: number = 1;

      const fn: jest.Mock = jest.fn();

      const alive: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      alive.ifDead(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      const value: number = 1;

      const fn: jest.Mock = jest.fn();

      const alive: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      alive.ifContradiction(() => {
        fn();
      });

      expect(fn.mock.calls).toHaveLength(0);
    });
  });

  describe('toString', () => {
    it('returns Alive and its retaining value', () => {
      expect(Alive.of<boolean, MockRuntimeError>(true).toString()).toBe('Alive: true');
    });
  });
});
