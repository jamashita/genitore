import type { MockRuntimeError } from '@jamashita/anden/error';
import type { Mock } from 'vitest';
import { MockChrono } from '../../mock/MockChrono.js';
import { DestroyChronoPlan } from '../DestroyChronoPlan.js';

describe('DestroyChronoPlan', () => {
  describe('onDestroy', () => {
    it('invokes third callback', () => {
      const value: number = -35;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const chrono: MockChrono<number, MockRuntimeError> = new MockChrono(
        () => {
          fn1();
        },
        () => {
          fn2();
        },
        (v: unknown) => {
          fn3();
          expect(v).toBe(value);
        },
        new Set()
      );
      const plan: DestroyChronoPlan<number, MockRuntimeError> = DestroyChronoPlan.of(chrono);

      plan.onDestroy(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });
});
