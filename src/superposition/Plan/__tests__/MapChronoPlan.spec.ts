import type { MockRuntimeError } from '@jamashita/anden/error';
import type { Mock } from 'vitest';
import { MockChrono } from '../../mock/MockChrono.js';
import { MapChronoPlan } from '../MapChronoPlan.js';

describe('MapChronoPlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const fn1: Mock = vi.fn();
      const fn2: Mock = vi.fn();
      const fn3: Mock = vi.fn();

      const chrono: MockChrono<number, MockRuntimeError> = new MockChrono(
        (v: number) => {
          fn1();
          expect(v).toBe(value);
        },
        () => {
          fn2();
        },
        () => {
          fn3();
        },
        new Set()
      );
      const plan: MapChronoPlan<number, MockRuntimeError> = MapChronoPlan.of(chrono);

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
