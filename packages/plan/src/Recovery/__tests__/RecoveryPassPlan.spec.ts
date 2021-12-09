import { SinonSpy, spy } from 'sinon';
import { RecoveryPassPlan } from '../RecoveryPassPlan';

describe('RecoveryPassPlan', () => {
  describe('onRecover', () => {
    it('invokes callback when onRecover() called', () => {
      const value: number = -35;

      const s: SinonSpy = spy();

      const epoque: RecoveryPassPlan<number> = RecoveryPassPlan.of<number>(
        (v: number) => {
          s();
          expect(v).toBe(value);
        }
      );

      epoque.onRecover(value);

      expect(s.called).toBe(true);
    });
  });
});
