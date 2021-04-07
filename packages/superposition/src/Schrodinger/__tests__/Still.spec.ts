import { MockRuntimeError } from '@jamashita/anden-error';
import { MockValueObject } from '@jamashita/anden-object';
import sinon, { SinonSpy } from 'sinon';
import { SuperpositionError } from '../../Error/SuperpositionError';
import { Alive } from '../Alive';
import { Contradiction } from '../Contradiction';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

describe('Still', () => {
  describe('get', () => {
    it('throws SuperpositionError', () => {
      expect.assertions(1);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(() => {
        still.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(still.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(still.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(still.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const still: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      still.ifAlive(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const still: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      still.ifDead(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const still: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      still.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(schrodinger.equals(schrodinger)).toBe(true);
    });

    it('returns false if different class instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(schrodinger.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true if Still given', () => {
      expect.assertions(4);

      const alive: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(null);
      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      const schrodinger: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(schrodinger.equals(alive)).toBe(false);
      expect(schrodinger.equals(dead)).toBe(false);
      expect(schrodinger.equals(contradiction)).toBe(false);
      expect(schrodinger.equals(still)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns Still', () => {
      expect.assertions(1);

      expect(Still.of<number, MockRuntimeError>().toString()).toBe('Still');
    });
  });
});
