import { MockRuntimeError } from '@jamashita/anden-error';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import { MockChrono } from '../../Mock/MockChrono';
import { MapChronoPlan } from '../MapChronoPlan';

describe('MapChronoPlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const fn1: jest.Mock = jest.fn();
      const fn2: jest.Mock = jest.fn();
      const fn3: jest.Mock = jest.fn();

      const chrono: MockChrono<number, MockRuntimeError> = new MockChrono<number, MockRuntimeError>(
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
        new Set<DeadConstructor<MockRuntimeError>>()
      );
      const plan: MapChronoPlan<number, MockRuntimeError> = MapChronoPlan.of<number, MockRuntimeError>(chrono);

      plan.onMap(value);

      expect(fn1.mock.calls).toHaveLength(1);
      expect(fn2.mock.calls).toHaveLength(0);
      expect(fn3.mock.calls).toHaveLength(0);
    });
  });
});
