import { MockRuntimeError } from '@jamashita/anden-error';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import { MockChrono } from '../../mock/MockChrono';
import { DestroyChronoPlan } from '../DestroyChronoPlan';

describe('DestroyChronoPlan', () => {
  describe('onDestroy', () => {
    it('invokes third callback', () => {
      const value: number = -35;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

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
        new Set<DeadConstructor<MockRuntimeError>>()
      );
      const plan: DestroyChronoPlan<number, MockRuntimeError> = DestroyChronoPlan.of(chrono);

      plan.onDestroy(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });
});
