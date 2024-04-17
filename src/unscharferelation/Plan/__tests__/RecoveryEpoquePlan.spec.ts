import type { Mock } from 'vitest';
import { MockEpoque } from '../../mock/MockEpoque.js';
import { RecoveryEpoquePlan } from '../RecoveryEpoquePlan.js';

describe('RecoveryEpoquePlan', () => {
  describe('onRecover', () => {
    it('invokes second callback', () => {
      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const epoque: MockEpoque<number> = new MockEpoque(
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
      const plan: RecoveryEpoquePlan<number> = RecoveryEpoquePlan.of(epoque);

      plan.onRecover();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
