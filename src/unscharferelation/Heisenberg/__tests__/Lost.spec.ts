import { MockRuntimeError } from '@jamashita/anden-error';
import sinon, { SinonSpy } from 'sinon';
import { Heisenberg } from '../Heisenberg';
import { Lost } from '../Lost';

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

  describe('toString', () => {
    it('returns Lost and its retaining cause', () => {
      expect.assertions(1);

      expect(Lost.of<number>(null).toString()).toBe('Lost: null');
    });
  });
});
