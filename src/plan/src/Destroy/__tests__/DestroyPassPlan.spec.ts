import { DestroyPassPlan } from '../DestroyPassPlan';

describe('DestroyPassPlan', () => {
  describe('onDestroy', () => {
    it('invokes callback when onDestroy() called', () => {
      const value: number = -35;

      const fn: jest.Mock = jest.fn();

      const plan: DestroyPassPlan = DestroyPassPlan.of(
        (v: unknown) => {
          fn();
          expect(v).toBe(value);
        }
      );

      plan.onDestroy(value);

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});
