import { MockEpoque } from '../../mock/MockEpoque.js';
import { MapEpoquePlan } from '../MapEpoquePlan.js';

describe('MapEpoquePlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value = -35;

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      const epoque = new MockEpoque<number>(
        (v: number) => {
          fn1();
          expect(v).toBe(value);
        },
        () => {
          fn2();
        },
        () => {
          fn3();
        }
      );
      const plan = MapEpoquePlan.of<number>(epoque);

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
