import { MockRuntimeError } from '@jamashita/anden-error';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import { SinonSpy, spy } from 'sinon';
import { MockChrono } from '../../Mock/MockChrono';
import { MapChronoPlan } from '../MapChronoPlan';

describe('MapChronoPlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      const chrono: MockChrono<number, MockRuntimeError> = new MockChrono<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        },
        new Set<DeadConstructor<MockRuntimeError>>()
      );
      const plan: MapChronoPlan<number, MockRuntimeError> = MapChronoPlan.of<number, MockRuntimeError>(chrono);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });
});
