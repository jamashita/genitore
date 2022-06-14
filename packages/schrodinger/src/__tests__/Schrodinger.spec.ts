import { MockRuntimeError } from '@jamashita/anden-error';
import { Alive } from '../Alive';
import { Contradiction } from '../Contradiction';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';

describe('Schroginer', () => {
  describe('all', () => {
    it('returns Alive with empty array when empty array given', () => {
      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = [];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = Schrodinger.all(schrodingers);

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toHaveLength(schrodingers.length);
    });

    it('returns Alive when sync Alive given', () => {
      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = [
        Alive.of(0),
        Alive.of(1),
        Alive.of(2)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = Schrodinger.all(schrodingers);

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array).toHaveLength(schrodingers.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const s: Schrodinger<number, MockRuntimeError> = schrodingers[i]!;

        expect(array[i]).toBe(s.get());
      }
    });

    it('returns Dead when sync Schrodingers which first one is Dead given', () => {
      const error: MockRuntimeError = new MockRuntimeError('');
      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = [
        Dead.of(error),
        Alive.of(1),
        Alive.of(2)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = Schrodinger.all(schrodingers);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Schrodinger when Schrodingers which second one is Dead given', () => {
      const error: MockRuntimeError = new MockRuntimeError('');
      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = [
        Alive.of(0),
        Dead.of(error),
        Alive.of(2)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = Schrodinger.all(schrodingers);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead when Schrodingers which last one is Dead given', () => {
      const error: MockRuntimeError = new MockRuntimeError('');
      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = [
        Alive.of(0),
        Alive.of(1),
        Dead.of(error)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = Schrodinger.all(schrodingers);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction when Schrodingers which contains Contradiction given', () => {
      const error: MockRuntimeError = new MockRuntimeError('');

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = [
        Alive.of(0),
        Contradiction.of(error),
        Alive.of(2)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = Schrodinger.all(schrodingers);

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction when Schrodingers which contains Contradiction given even if all of others are Dead', () => {
      const error1: MockRuntimeError = new MockRuntimeError('');
      const error2: MockRuntimeError = new MockRuntimeError('');
      const error3: MockRuntimeError = new MockRuntimeError('');

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = [
        Dead.of(error1),
        Contradiction.of(error2),
        Dead.of(error3)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = Schrodinger.all(schrodingers);

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });
  });
});
