import { PassPlan } from '../../../plan/index.js';
import { CombinedEpoquePlan } from '../CombinedEpoquePlan.js';

describe('CombinedEpoquePlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value = -35;

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      const pass = PassPlan.of<number, void>(
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
      const plan = CombinedEpoquePlan.of<number>(pass, pass, pass);

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('onRecover', () => {
    it('invokes second callback', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      const pass = PassPlan.of<number, void>(
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
      const plan = CombinedEpoquePlan.of<number>(pass, pass, pass);

      plan.onRecover();

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(1);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });

  describe('onDestroy', () => {
    it('invokes third callback', () => {
      const value = -35;

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      const pass = PassPlan.of<number, void>(
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
      const plan = CombinedEpoquePlan.of<number>(pass, pass, pass);

      plan.onDestroy(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });
});
