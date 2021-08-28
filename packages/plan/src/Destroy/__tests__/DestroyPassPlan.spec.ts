import { SinonSpy, spy } from 'sinon';
import { DestroyPassPlan } from '../DestroyPassPlan';

describe('DestroyPassPlan', () => {
  describe('onDestroy', () => {
    it('invokes callback when onDestroy() called', () => {
      expect.assertions(2);

      const value: number = -35;

      const s: SinonSpy = spy();

      const plan: DestroyPassPlan = DestroyPassPlan.of(
        (v: unknown) => {
          s();
          expect(v).toBe(value);
        }
      );

      plan.onDestroy(value);

      expect(s.called).toBe(true);
    });
  });
});
