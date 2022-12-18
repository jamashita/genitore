import { Mock } from 'vitest';
import { MapPassPlan } from '../MapPassPlan.js';

describe('MapPassPlan', () => {
  describe('onMap', () => {
    it('invokes callback when onMap() called', () => {
      const value: number = -35;

      const fn: Mock = vi.fn();

      const plan: MapPassPlan<number> = MapPassPlan.of(
        (v: number) => {
          fn();
          expect(v).toBe(value);
        }
      );

      plan.onMap(value);

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});
