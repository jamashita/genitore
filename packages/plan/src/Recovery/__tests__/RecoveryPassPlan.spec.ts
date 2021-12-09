import { RecoveryPassPlan } from '../RecoveryPassPlan';

describe('RecoveryPassPlan', () => {
  describe('onRecover', () => {
    it('invokes callback when onRecover() called', () => {
      const value: number = -35;

      const fn: jest.Mock = jest.fn();

      const epoque: RecoveryPassPlan<number> = RecoveryPassPlan.of<number>(
        (v: number) => {
          fn();
          expect(v).toBe(value);
        }
      );

      epoque.onRecover(value);

      expect(fn.mock.calls).toHaveLength(1);
    });
  });
});
