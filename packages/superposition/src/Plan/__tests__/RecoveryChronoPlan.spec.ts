import { MockRuntimeError } from '@jamashita/anden-error';
import { MockChrono } from '../../mock/MockChrono';
import { RecoveryChronoPlan } from '../RecoveryChronoPlan';

describe('RecoveryChronoPlan', () => {
  describe('onRecover', () => {
    it('invokes second callback', () => {
      const value: MockRuntimeError = new MockRuntimeError();

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      const chrono: MockChrono<number, MockRuntimeError> = new MockChrono(
        () => {
          fn1();
        },
        (v: MockRuntimeError) => {
          fn2();
          expect(v).toBe(value);
        },
        () => {
          fn3();
        },
        new Set()
      );
      const plan: RecoveryChronoPlan<number, MockRuntimeError> = RecoveryChronoPlan.of(chrono);

      plan.onRecover(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
