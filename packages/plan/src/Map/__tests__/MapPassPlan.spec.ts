import { MapPassPlan } from '../MapPassPlan';

describe('MapPassPlan', () => {
  describe('onMap', () => {
    it('invokes callback when onMap() called', () => {
      const value: number = -35;

      const fn: jest.Mock = jest.fn();

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
