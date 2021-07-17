import { MockRuntimeError } from '@jamashita/anden-error';
import sinon, { SinonSpy } from 'sinon';
import { Dead } from '../Dead.js';
import { Schrodinger } from '../Schrodinger.js';

describe('Dead', () => {
  describe('get', () => {
    it('throws the inner error', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      expect(() => {
        dead.get();
      }).toThrow(error);
    });
  });

  describe('getError', () => {
    it('returns thrown error', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      expect(dead.getError()).toBe(error);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      expect.assertions(2);

      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(dead1.isAlive()).toBe(false);
      expect(dead2.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns true', () => {
      expect.assertions(2);

      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(dead1.isDead()).toBe(true);
      expect(dead2.isDead()).toBe(true);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      expect.assertions(2);

      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(dead1.isContradiction()).toBe(false);
      expect(dead2.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy: SinonSpy = sinon.spy();

      const dead: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      dead.ifAlive(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifDead', () => {
    it('will be invoked', () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy: SinonSpy = sinon.spy();

      const dead: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      dead.ifDead((e: MockRuntimeError) => {
        spy();
        expect(e).toBe(error);
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy: SinonSpy = sinon.spy();

      const dead: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      dead.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Dead and its retaining error', () => {
      expect.assertions(1);

      expect(Dead.of<number, Error>(new MockRuntimeError()).toString()).toBe('Dead: MockRuntimeError { noun: \'MockRuntimeError\' }');
    });
  });
});
