import sinon, { SinonSpy } from 'sinon';
import { MockEpoque } from '../../Epoque/Mock/MockEpoque';
import { RecoveryEpoquePlan } from '../RecoveryEpoquePlan';

describe('RecoveryEpoquePlan', () => {
  describe('onRecover', () => {
    it('invokes second callback', () => {
      expect.assertions(3);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: MockEpoque<number> = new MockEpoque<number>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );
      const plan: RecoveryEpoquePlan<number> = RecoveryEpoquePlan.of<number>(epoque);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });
});
