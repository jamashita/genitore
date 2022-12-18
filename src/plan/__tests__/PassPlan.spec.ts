import { Mock } from 'vitest';
import { PassPlan } from '../PassPlan.js';

describe('PassPlan', () => {
  describe('onDestroy', () => {
    it('invokes third callback when onDestroy() called', () => {
      const value: number = -35;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const plan: PassPlan<number, string> = PassPlan.of(
        () => {
          fn1();
        },
        () => {
          fn2();
        },
        (n: unknown) => {
          fn3();
          expect(n).toBe(value);
        }
      );

      plan.onDestroy(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });

  describe('onMap', () => {
    it('invokes first callback when onMap() called', () => {
      const value: number = -35;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const plan: PassPlan<number, string> = PassPlan.of(
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

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('onRecover', () => {
    it('invokes second callback when onRecover() called', () => {
      const value: string = 'halt';

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const plan: PassPlan<number, string> = PassPlan.of(
        () => {
          fn1();
        },
        (v: string) => {
          fn2();
          expect(v).toBe(value);
        },
        () => {
          fn3();
        }
      );

      plan.onRecover(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
