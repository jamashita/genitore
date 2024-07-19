import { MockEpoque } from '../../mock/MockEpoque.js';
import { RecoveryEpoquePlan } from '../RecoveryEpoquePlan.js';

describe('RecoveryEpoquePlan', () => {
  describe('onRecover', () => {
    it('invokes second callback', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      const epoque = new MockEpoque<number>(
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
      const plan = RecoveryEpoquePlan.of<number>(epoque);

      plan.onRecover();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
