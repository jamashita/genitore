import { MockEpoque } from '../../mock/MockEpoque.js';
import { DestroyEpoquePlan } from '../DestroyEpoquePlan.js';

describe('DestroyEpoquePlan', () => {
  describe('onDestroy', () => {
    it('invokes third callback', () => {
      const value = -35;

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      const epoque = new MockEpoque<number>(
        () => {
          fn1();
        },
        () => {
          fn2();
        },
        (v: unknown) => {
          fn3();
          expect(v).toBe(value);
        }
      );
      const plan = DestroyEpoquePlan.of<number>(epoque);

      plan.onDestroy(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });
});
