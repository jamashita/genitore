import { MockRuntimeError } from '@jamashita/anden-error';
import { SinonSpy, spy } from 'sinon';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';

describe('Dead', () => {
  describe('get', () => {
    it('throws the inner error', () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      expect(() => {
        dead.get();
      }).toThrow(error);
    });
  });

  describe('getError', () => {
    it('returns thrown error', () => {
      const error: MockRuntimeError = new MockRuntimeError();
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      expect(dead.getError()).toBe(error);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(dead1.isAlive()).toBe(false);
      expect(dead2.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns true', () => {
      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(dead1.isDead()).toBe(true);
      expect(dead2.isDead()).toBe(true);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(dead1.isContradiction()).toBe(false);
      expect(dead2.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const s: SinonSpy = spy();

      const dead: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      dead.ifAlive(() => {
        s();
      });

      expect(s.called).toBe(false);
    });
  });

  describe('ifDead', () => {
    it('will be invoked', () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const s: SinonSpy = spy();

      const dead: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      dead.ifDead((e: MockRuntimeError) => {
        s();
        expect(e).toBe(error);
      });

      expect(s.called).toBe(true);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      const error: MockRuntimeError = new MockRuntimeError();

      const s: SinonSpy = spy();

      const dead: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      dead.ifContradiction(() => {
        s();
      });

      expect(s.called).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Dead and its retaining error', () => {
      expect(Dead.of<number, Error>(new MockRuntimeError()).toString()).toBe('Dead: MockRuntimeError {}');
    });
  });
});