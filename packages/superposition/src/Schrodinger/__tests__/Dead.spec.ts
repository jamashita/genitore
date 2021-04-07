import { MockRuntimeError } from '@jamashita/publikum-error';
import { Equalable } from '@jamashita/publikum-interface';
import { MockValueObject } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { Alive } from '../Alive';
import { Contradiction } from '../Contradiction';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

class EqualableError extends MockRuntimeError implements Equalable {
  private readonly identifier: unknown;

  public constructor(identifier: unknown) {
    super();
    this.identifier = identifier;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof EqualableError)) {
      return false;
    }

    return this.identifier === other.identifier;
  }
}

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

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(schrodinger.equals(schrodinger)).toBe(true);
    });

    it('returns false if the different class instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(schrodinger.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true if the same error Dead given', () => {
      expect.assertions(5);

      const error: MockRuntimeError = new MockRuntimeError();

      const alive: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);
      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(null);
      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      const schrodinger: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      expect(schrodinger.equals(alive)).toBe(false);
      expect(schrodinger.equals(dead1)).toBe(true);
      expect(schrodinger.equals(dead2)).toBe(false);
      expect(schrodinger.equals(contradiction)).toBe(false);
      expect(schrodinger.equals(still)).toBe(false);
    });

    it('returns true if the same Equalable instance given', () => {
      expect.assertions(2);

      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, EqualableError>(new EqualableError('error 1'));
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, EqualableError>(new EqualableError('error 2'));

      const schrodinger: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new EqualableError('error 1'));

      expect(schrodinger.equals(dead1)).toBe(true);
      expect(schrodinger.equals(dead2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Dead and its retaining error', () => {
      expect.assertions(1);

      expect(Dead.of<number, Error>(new MockRuntimeError()).toString()).toBe('Dead: MockRuntimeError { noun: \'MockRuntimeError\' }');
    });
  });
});
