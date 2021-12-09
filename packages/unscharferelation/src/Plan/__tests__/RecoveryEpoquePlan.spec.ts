import { MockEpoque } from '../../Mock/MockEpoque';
import { RecoveryEpoquePlan } from '../RecoveryEpoquePlan';

describe('RecoveryEpoquePlan', () => {
  describe('onRecover', () => {
    it('invokes second callback', () => {
      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      const epoque: MockEpoque<number> = new MockEpoque<number>(
        () => {
          fn1();
        },
        () => {
          fn2();
        },
        () => {
          fn3();
        }
      );
      const plan: RecoveryEpoquePlan<number> = RecoveryEpoquePlan.of<number>(epoque);

      plan.onRecover();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
