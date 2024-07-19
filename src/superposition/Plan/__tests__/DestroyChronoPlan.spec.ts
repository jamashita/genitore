import type { MockRuntimeError } from '@jamashita/anden/error';
import { MockChrono } from '../../mock/MockChrono.js';
import { DestroyChronoPlan } from '../DestroyChronoPlan.js';

describe('DestroyChronoPlan', () => {
  describe('onDestroy', () => {
    it('invokes third callback', () => {
      const value = -35;

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      const chrono = new MockChrono<number, MockRuntimeError>(
        () => {
          fn1();
        },
        () => {
          fn2();
        },
        (v: unknown) => {
          fn3();
          expect(v).toBe(value);
        }
      );
      const plan = DestroyChronoPlan.of<number, MockRuntimeError>(chrono);

      plan.onDestroy(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });
});
