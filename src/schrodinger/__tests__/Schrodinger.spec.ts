import { MockRuntimeError } from '@jamashita/anden/error';
import { Alive } from '../Alive.js';
import { Contradiction } from '../Contradiction.js';
import { Dead } from '../Dead.js';
import { Schrodinger } from '../Schrodinger.js';

describe('Schroginer', () => {
  describe('all', () => {
    it('returns Alive with empty array when empty array given', () => {
      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = [];

      const schrodinger = Schrodinger.all(schrodingers);

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toHaveLength(schrodingers.length);
    });

    it('returns Alive when sync Alive given', () => {
      const schrodingers = [Alive.of(0), Alive.of(1), Alive.of(2)];

      const schrodinger = Schrodinger.all(schrodingers);

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array).toHaveLength(schrodingers.length);
      for (let i = 0; i < array.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const s = schrodingers[i]!;

        expect(array[i]).toBe(s.get());
      }
    });

    it('returns Dead when sync Schrodingers which first one is Dead given', () => {
      const error = new MockRuntimeError('');
      const schrodingers = [Dead.of(error), Alive.of(1), Alive.of(2)];

      const schrodinger = Schrodinger.all(schrodingers);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Schrodinger when Schrodingers which second one is Dead given', () => {
      const error = new MockRuntimeError('');
      const schrodingers = [Alive.of(0), Dead.of(error), Alive.of(2)];

      const schrodinger = Schrodinger.all(schrodingers);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Dead when Schrodingers which last one is Dead given', () => {
      const error = new MockRuntimeError('');
      const schrodingers = [Alive.of(0), Alive.of(1), Dead.of(error)];

      const schrodinger = Schrodinger.all(schrodingers);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction when Schrodingers which contains Contradiction given', () => {
      const error = new MockRuntimeError('');

      const schrodingers = [Alive.of(0), Contradiction.of(error), Alive.of(2)];

      const schrodinger = Schrodinger.all(schrodingers);

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('returns Contradiction when Schrodingers which contains Contradiction given even if all of others are Dead', () => {
      const error1 = new MockRuntimeError('');
      const error2 = new MockRuntimeError('');
      const error3 = new MockRuntimeError('');

      const schrodingers = [Dead.of(error1), Contradiction.of(error2), Dead.of(error3)];

      const schrodinger = Schrodinger.all(schrodingers);

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });
  });
});
