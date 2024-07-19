import { RecoveryPassPlan } from '../RecoveryPassPlan.js';

describe('RecoveryPassPlan', () => {
  describe('onRecover', () => {
    it('invokes callback when onRecover() called', () => {
      const value = -35;

      const fn = vi.fn();

      const plan = RecoveryPassPlan.of<number>((v: number) => {
        fn();
        expect(v).toBe(value);
      });

      plan.onRecover(value);

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});
