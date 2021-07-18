import sinon, { SinonSpy } from 'sinon';
import { RecoveryPassPlan } from '../RecoveryPassPlan.js';

describe('RecoveryPassPlan', () => {
  describe('onRecover', () => {
    it('invokes callback when onRecover() called', () => {
      expect.assertions(2);

      const value: number = -35;

      const spy: SinonSpy = sinon.spy();

      const epoque: RecoveryPassPlan<number> = RecoveryPassPlan.of<number>(
        (v: number) => {
          spy();
          expect(v).toBe(value);
        }
      );

      epoque.onRecover(value);

      expect(spy.called).toBe(true);
    });
  });
});
