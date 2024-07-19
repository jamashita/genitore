import { MapPassPlan } from '../MapPassPlan.js';

describe('MapPassPlan', () => {
  describe('onMap', () => {
    it('invokes callback when onMap() called', () => {
      const value = -35;

      const fn = vi.fn();

      const plan = MapPassPlan.of<number>((v: number) => {
        fn();
        expect(v).toBe(value);
      });

      plan.onMap(value);

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});
