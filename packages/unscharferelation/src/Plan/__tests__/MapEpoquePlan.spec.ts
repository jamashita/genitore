import { MockEpoque } from '../../Mock/MockEpoque';
import { MapEpoquePlan } from '../MapEpoquePlan';

describe('MapEpoquePlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      const epoque: MockEpoque<number> = new MockEpoque<number>(
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
      const plan: MapEpoquePlan<number> = MapEpoquePlan.of<number>(epoque);

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
