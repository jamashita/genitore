import { MockRuntimeError } from '@jamashita/anden/error';
import type { Mock } from 'vitest';
import { PassPlan } from '../../../plan/index.js';
import { CombinedChronoPlan } from '../CombinedChronoPlan.js';

describe('CombinedChronoPlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const pass: PassPlan<number, MockRuntimeError> = PassPlan.of(
        (v: number) => {
          fn1();
          expect(v).toBe(value);
        },
        () => {
          fn2();
        },
        () => {
          fn3();
        }
      );
      const plan: CombinedChronoPlan<number, MockRuntimeError> = CombinedChronoPlan.of(pass, pass, pass);

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('onRecover', () => {
    it('invokes second callback', () => {
      const value: MockRuntimeError = new MockRuntimeError('');

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const pass: PassPlan<number, MockRuntimeError> = PassPlan.of(
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
      const plan: CombinedChronoPlan<number, MockRuntimeError> = CombinedChronoPlan.of(pass, pass, pass);

      plan.onRecover(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('onDestroy', () => {
    it('invokes third callback', () => {
      const value: number = -35;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const pass: PassPlan<number, MockRuntimeError> = PassPlan.of(
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
      const plan: CombinedChronoPlan<number, MockRuntimeError> = CombinedChronoPlan.of(pass, pass, pass);

      plan.onDestroy(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });
});
