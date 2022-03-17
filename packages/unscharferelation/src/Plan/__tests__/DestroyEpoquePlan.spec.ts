import { MockEpoque } from '../../Mock/MockEpoque';
import { DestroyEpoquePlan } from '../DestroyEpoquePlan';

describe('DestroyEpoquePlan', () => {
  describe('onDestroy', () => {
    it('invokes third callback', () => {
      const value: number = -35;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      const epoque: MockEpoque<number> = new MockEpoque(
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
      const plan: DestroyEpoquePlan<number> = DestroyEpoquePlan.of(epoque);

      plan.onDestroy(value);

      expect(fn1.mock.calls).toHaveLength(0);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(1);
    });
  });
});
