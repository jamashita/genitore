import { MockRuntimeError } from '@jamashita/publikum-error';
import { MockValueObject } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { Absent } from '../Absent';
import { Heisenberg } from '../Heisenberg';
import { Lost } from '../Lost';
import { Present } from '../Present';
import { Uncertain } from '../Uncertain';

describe('Lost', () => {
  describe('get', () => {
    it('throws given error', () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const lost1: Lost<void> = Lost.of<void>(error1);
      const lost2: Lost<number> = Lost.of<number>(error2);

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
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const lost1: Lost<void> = Lost.of<void>(error1);
      const lost2: Lost<number> = Lost.of<number>(error2);

      expect(lost1.getCause()).toBe(error1);
      expect(lost2.getCause()).toBe(error2);
    });
  });

  describe('isPresent', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();
      const lost: Lost<void> = Lost.of<void>(error);

      expect(lost.isPresent()).toBe(false);
    });
  });
  describe('isAbsent', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();
      const lost: Lost<void> = Lost.of<void>(error);

      expect(lost.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('always returns true', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();
      const lost: Lost<void> = Lost.of<void>(error);

      expect(lost.isLost()).toBe(true);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy: SinonSpy = sinon.spy();

      const lost: Heisenberg<number> = Lost.of<number>(error);

      lost.ifPresent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy: SinonSpy = sinon.spy();

      const lost: Heisenberg<number> = Lost.of<number>(error);

      lost.ifAbsent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifLost', () => {
    it('will be invoked', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy: SinonSpy = sinon.spy();

      const lost: Heisenberg<number> = Lost.of<number>(error);

      lost.ifLost(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const heisenberg: Heisenberg<number> = Lost.of<number>(new SyntaxError());

      expect(heisenberg.equals(heisenberg)).toBe(true);
    });

    it('returns false if the different class instance given', () => {
      expect.assertions(1);

      const heisenberg: Heisenberg<number> = Lost.of<number>(undefined);

      expect(heisenberg.equals(new MockValueObject<string>('mock'))).toBe(false);
    });

    it('returns true if the same value Lost given', () => {
      expect.assertions(5);

      const present: Present<number> = Present.of<number>(2);
      const absent: Absent<number> = Absent.of<number>();
      const lost1: Lost<number> = Lost.of<number>(null);
      const lost2: Lost<number> = Lost.of<number>(undefined);
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      const heisenberg: Heisenberg<number> = Lost.of<number>(null);

      expect(heisenberg.equals(present)).toBe(false);
      expect(heisenberg.equals(absent)).toBe(false);
      expect(heisenberg.equals(lost1)).toBe(true);
      expect(heisenberg.equals(lost2)).toBe(false);
      expect(heisenberg.equals(uncertain)).toBe(false);
    });

    it('returns true if the same Equalable instance given', () => {
      expect.assertions(2);

      const lost1: Lost<number> = Lost.of<number>(new MockValueObject<string>('mock 1'));
      const lost2: Lost<number> = Lost.of<number>(new MockValueObject<string>('mock 2'));

      const heisenberg: Heisenberg<number> = Lost.of<number>(new MockValueObject<string>('mock 1'));

      expect(heisenberg.equals(lost1)).toBe(true);
      expect(heisenberg.equals(lost2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Lost and its retaining cause', () => {
      expect.assertions(1);

      expect(Lost.of<number>(null).toString()).toBe('Lost: null');
    });
  });
});
