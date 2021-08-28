import { MockRuntimeError } from '@jamashita/anden-error';
import { SinonSpy, spy } from 'sinon';
import { SchrodingerError } from '../Error/SchrodingerError';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

describe('Still', () => {
  describe('get', () => {
    it('throws SchrodingerError', () => {
      expect.assertions(1);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(() => {
        still.get();
      }).toThrow(SchrodingerError);
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

      const s: SinonSpy = spy();

      const still: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      still.ifAlive(() => {
        spy();
      });

      expect(s.called).toBe(false);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const s: SinonSpy = spy();

      const still: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      still.ifDead(() => {
        spy();
      });

      expect(s.called).toBe(false);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const s: SinonSpy = spy();

      const still: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      still.ifContradiction(() => {
        spy();
      });

      expect(s.called).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Still', () => {
      expect.assertions(1);

      expect(Still.of<number, MockRuntimeError>().toString()).toBe('Still');
    });
  });
});
