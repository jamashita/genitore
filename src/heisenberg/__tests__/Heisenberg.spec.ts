import { MockRuntimeError } from '@jamashita/anden/error';
import { Absent } from '../Absent.js';
import { Heisenberg } from '../Heisenberg.js';
import { HeisenbergError } from '../HeisenbergError.js';
import { Lost } from '../Lost.js';
import { Present } from '../Present.js';

describe('Heisenberg', () => {
  describe('all', () => {
    it('returns Present with empty array when empty array given', () => {
      const heisenbergs: Array<Heisenberg<number>> = [];

      const heisenberg = Heisenberg.all(heisenbergs);

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toHaveLength(heisenbergs.length);
    });

    it('returns Present when Present given', () => {
      const heisenbergs = [Present.of(0), Present.of(1), Present.of(2)];

      const heisenberg = Heisenberg.all(heisenbergs);

      expect(heisenberg.isPresent()).toBe(true);

      const array = heisenberg.get();

      expect(array).toHaveLength(heisenbergs.length);
      for (let i = 0; i < array.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const h = heisenbergs[i]!;

        expect(array[i]).toBe(h.get());
      }
    });

    it('returns Absent with Heisenbergs which first one is Absent given', () => {
      const heisenbergs = [Absent.of(), Present.of(1), Present.of(2)];

      const heisenberg = Heisenberg.all(heisenbergs);

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent with Heisenbergs which second one is Absent given', () => {
      const heisenbergs = [Present.of(1), Absent.of(), Present.of(2)];

      const heisenberg = Heisenberg.all(heisenbergs);

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Absent with Heisenbergs which last one is Absent given', () => {
      const heisenbergs = [Present.of(0), Present.of(1), Absent.of()];
      const heisenberg = Heisenberg.all(heisenbergs);

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(HeisenbergError);
    });

    it('returns Lost when Heisenbergs which contains Lost given', () => {
      const error = new MockRuntimeError('');

      const heisenbergs = [Present.of(0), Lost.of(error), Present.of(2)];

      const heisenberg = Heisenberg.all(heisenbergs);

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });

    it('returns Lost when Heisenbergs which contains Lost given even if all of others are Absent', () => {
      const error = new MockRuntimeError('');

      const heisenbergs = [Absent.of(), Lost.of(error), Absent.of()];

      const heisenberg = Heisenberg.all(heisenbergs);

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });
});
