import { MockRuntimeError } from '@jamashita/publikum-error';
import { MockValueObject } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { Alive } from '../Alive';
import { Contradiction } from '../Contradiction';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

describe('Contradiction', () => {
  describe('get', () => {
    it('throws given error', () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const contradiction1: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error1);
      const contradiction2: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error2);

      expect(() => {
        contradiction1.get();
      }).toThrow(error1);
      expect(() => {
        contradiction2.get();
      }).toThrow(error2);
    });
  });

  describe('getCause', () => {
    it('returns thrown error', () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const contradiction1: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error1);
      const contradiction2: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error2);

      expect(contradiction1.getCause()).toBe(error1);
      expect(contradiction2.getCause()).toBe(error2);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error);

      expect(contradiction.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error);

      expect(contradiction.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns true', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(error);

      expect(contradiction.isContradiction()).toBe(true);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const contradiction: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(value);

      contradiction.ifAlive(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const contradiction: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(value);

      contradiction.ifDead(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifContradiction', () => {
    it('will be invoked', () => {
      expect.assertions(2);

      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const contradiction: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(value);

      contradiction.ifContradiction((v: unknown) => {
        spy();
        expect(v).toBe(value);
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(undefined);

      expect(schrodinger.equals(schrodinger)).toBe(true);
    });

    it('returns false if the different class instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(undefined);

      expect(schrodinger.equals(new MockValueObject<string>('mock'))).toBe(false);
    });

    it('returns true if the same value Contradiction given', () => {
      expect.assertions(5);

      const alive: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const contradiction1: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(null);
      const contradiction2: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(undefined);
      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      const schrodinger: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(null);

      expect(schrodinger.equals(alive)).toBe(false);
      expect(schrodinger.equals(dead)).toBe(false);
      expect(schrodinger.equals(contradiction1)).toBe(true);
      expect(schrodinger.equals(contradiction2)).toBe(false);
      expect(schrodinger.equals(still)).toBe(false);
    });

    it('returns true if the same Equalable instance given', () => {
      expect.assertions(2);

      const contradiction1: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(new MockValueObject<string>('mock 1'));
      const contradiction2: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(new MockValueObject<string>('mock 2'));

      const schrodinger: Schrodinger<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(new MockValueObject<string>('mock 1'));

      expect(schrodinger.equals(contradiction1)).toBe(true);
      expect(schrodinger.equals(contradiction2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Contradiction and its retaining cause', () => {
      expect.assertions(1);

      expect(Contradiction.of<number, MockRuntimeError>(null).toString()).toBe('Contradiction: null');
    });
  });
});
