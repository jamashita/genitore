import { MockRuntimeError } from '@jamashita/anden-error';
import { MockValueObject } from '@jamashita/anden-object';
import sinon, { SinonSpy } from 'sinon';
import { UnscharferelationError } from '../../Error/UnscharferelationError';
import { Absent } from '../Absent';
import { Heisenberg } from '../Heisenberg';
import { Lost } from '../Lost';
import { Present } from '../Present';
import { Uncertain } from '../Uncertain';

describe('Uncertain', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      expect.assertions(1);

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      expect(() => {
        uncertain.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('isPresent', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain.isPresent()).toBe(false);
    });
  });

  describe('isAbsent', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain.isLost()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const uncertain: Heisenberg<number> = Uncertain.of<number>();

      uncertain.ifPresent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const uncertain: Heisenberg<number> = Uncertain.of<number>();

      uncertain.ifAbsent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const uncertain: Heisenberg<number> = Uncertain.of<number>();

      uncertain.ifLost(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const heisenberg: Heisenberg<number> = Uncertain.of<number>();

      expect(heisenberg.equals(heisenberg)).toBe(true);
    });

    it('returns false if the different class instance given', () => {
      expect.assertions(1);

      const heisenberg: Heisenberg<number> = Uncertain.of<number>();

      expect(heisenberg.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true if Uncertain given', () => {
      expect.assertions(4);

      const present: Present<number> = Present.of<number>(2);
      const absent: Absent<number> = Absent.of<number>();
      const lost: Lost<number> = Lost.of<number>(new MockRuntimeError());
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      const heisenberg: Heisenberg<number> = Uncertain.of<number>();

      expect(heisenberg.equals(present)).toBe(false);
      expect(heisenberg.equals(absent)).toBe(false);
      expect(heisenberg.equals(lost)).toBe(false);
      expect(heisenberg.equals(uncertain)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns Uncertain', () => {
      expect.assertions(1);

      expect(Uncertain.of<number>().toString()).toBe('Uncertain');
    });
  });
});
