import type { Mock } from 'vitest';
import { MockEpoque } from '../../mock/MockEpoque.js';
import { MapEpoquePlan } from '../MapEpoquePlan.js';

describe('MapEpoquePlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const epoque: MockEpoque<number> = new MockEpoque(
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
      const plan: MapEpoquePlan<number> = MapEpoquePlan.of(epoque);

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
