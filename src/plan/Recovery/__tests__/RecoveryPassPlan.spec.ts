import { Mock } from 'vitest';
import { RecoveryPassPlan } from '../RecoveryPassPlan.js';

describe('RecoveryPassPlan', () => {
  describe('onRecover', () => {
    it('invokes callback when onRecover() called', () => {
      const value: number = -35;

      const fn: Mock = vi.fn();

      const plan: RecoveryPassPlan<number> = RecoveryPassPlan.of(
        (v: number) => {
          fn();
          expect(v).toBe(value);
        }
      );

      plan.onRecover(value);

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});
