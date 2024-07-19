import { MockRuntimeError } from '@jamashita/anden/error';
import { MockChrono } from '../../mock/MockChrono.js';
import { RecoveryChronoPlan } from '../RecoveryChronoPlan.js';

describe('RecoveryChronoPlan', () => {
  describe('onRecover', () => {
    it('invokes second callback', () => {
      const value = new MockRuntimeError('');

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      const chrono = new MockChrono<number, MockRuntimeError>(
        () => {
          fn1();
        },
        (v: MockRuntimeError) => {
          fn2();
          expect(v).toBe(value);
        },
        () => {
          fn3();
        }
      );
      const plan = RecoveryChronoPlan.of<number, MockRuntimeError>(chrono);

      plan.onRecover(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
