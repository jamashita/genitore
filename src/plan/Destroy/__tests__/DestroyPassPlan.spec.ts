import { DestroyPassPlan } from '../DestroyPassPlan.js';

describe('DestroyPassPlan', () => {
  describe('onDestroy', () => {
    it('invokes callback when onDestroy() called', () => {
      const value = -35;

      const fn = vi.fn();

      const plan = DestroyPassPlan.of((v: unknown) => {
        fn();
        expect(v).toBe(value);
      });

      plan.onDestroy(value);

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});
