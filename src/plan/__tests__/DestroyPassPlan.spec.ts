import sinon, { SinonSpy } from 'sinon';
import { DestroyPassPlan } from '../DestroyPassPlan';

describe('DestroyPassPlan', () => {
  describe('onDestroy', () => {
    it('invokes callback when onDestroy() called', () => {
      expect.assertions(2);

      const value: number = -35;

      const spy: SinonSpy = sinon.spy();

      const plan: DestroyPassPlan = DestroyPassPlan.of(
        (v: unknown) => {
          spy();
          expect(v).toBe(value);
        }
      );

      plan.onDestroy(value);

      expect(spy.called).toBe(true);
    });
  });
});
