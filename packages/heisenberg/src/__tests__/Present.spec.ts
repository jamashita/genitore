import sinon, { SinonSpy } from 'sinon';
import { Heisenberg } from '../Heisenberg.js';
import { Present } from '../Present.js';

describe('Present', () => {
  describe('get', () => {
    it('returns the inner value', () => {
      expect.assertions(7);

      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(0);
      const present3: Present<number> = Present.of<number>(-1);
      const present4: Present<string> = Present.of<string>('');
      const present5: Present<string> = Present.of<string>('1');
      const present6: Present<boolean> = Present.of<boolean>(true);
      const present7: Present<boolean> = Present.of<boolean>(false);

      expect(present1.get()).toBe(1);
      expect(present2.get()).toBe(0);
      expect(present3.get()).toBe(-1);
      expect(present4.get()).toBe('');
      expect(present5.get()).toBe('1');
      expect(present6.get()).toBe(true);
      expect(present7.get()).toBe(false);
    });
  });

  describe('isPresent', () => {
    it('always returns true', () => {
      expect.assertions(7);

      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(0);
      const present3: Present<number> = Present.of<number>(-1);
      const present4: Present<string> = Present.of<string>('');
      const present5: Present<string> = Present.of<string>('1');
      const present6: Present<boolean> = Present.of<boolean>(true);
      const present7: Present<boolean> = Present.of<boolean>(false);

      expect(present1.isPresent()).toBe(true);
      expect(present2.isPresent()).toBe(true);
      expect(present3.isPresent()).toBe(true);
      expect(present4.isPresent()).toBe(true);
      expect(present5.isPresent()).toBe(true);
      expect(present6.isPresent()).toBe(true);
      expect(present7.isPresent()).toBe(true);
    });
  });

  describe('isAbsent', () => {
    it('always returns false', () => {
      expect.assertions(7);

      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(0);
      const present3: Present<number> = Present.of<number>(-1);
      const present4: Present<string> = Present.of<string>('');
      const present5: Present<string> = Present.of<string>('1');
      const present6: Present<boolean> = Present.of<boolean>(true);
      const present7: Present<boolean> = Present.of<boolean>(false);

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
      expect.assertions(7);

      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(0);
      const present3: Present<number> = Present.of<number>(-1);
      const present4: Present<string> = Present.of<string>('');
      const present5: Present<string> = Present.of<string>('1');
      const present6: Present<boolean> = Present.of<boolean>(true);
      const present7: Present<boolean> = Present.of<boolean>(false);

      expect(present1.isLost()).toBe(false);
      expect(present2.isLost()).toBe(false);
      expect(present3.isLost()).toBe(false);
      expect(present4.isLost()).toBe(false);
      expect(present5.isLost()).toBe(false);
      expect(present6.isLost()).toBe(false);
      expect(present7.isLost()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('will be invoked', () => {
      expect.assertions(2);

      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const present: Heisenberg<number> = Present.of<number>(value);

      present.ifPresent((v: number) => {
        spy();
        expect(v).toBe(value);
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const present: Heisenberg<number> = Present.of<number>(value);

      present.ifAbsent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const present: Heisenberg<number> = Present.of<number>(value);

      present.ifLost(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Present and its retaining value', () => {
      expect.assertions(1);

      expect(Present.of<boolean>(true).toString()).toBe('Present: true');
    });
  });
});
