import sinon, { SinonSpy } from 'sinon';
import { HeisenbergError } from '../Error/HeisenbergError.js';
import { Heisenberg } from '../Heisenberg.js';
import { Uncertain } from '../Uncertain.js';

describe('Uncertain', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      expect.assertions(1);

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      expect(() => {
        uncertain.get();
      }).toThrow(HeisenbergError);
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

  describe('toString', () => {
    it('returns Uncertain', () => {
      expect.assertions(1);

      expect(Uncertain.of<number>().toString()).toBe('Uncertain');
    });
  });
});
