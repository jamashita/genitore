import type { MockRuntimeError } from '@jamashita/anden/error';
import { MockChrono } from '../../mock/MockChrono.js';
import { MapChronoPlan } from '../MapChronoPlan.js';

describe('MapChronoPlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const fn3 = vi.fn();

      const chrono = new MockChrono<number, MockRuntimeError>(
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
      const plan = MapChronoPlan.of<number, MockRuntimeError>(chrono);

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
