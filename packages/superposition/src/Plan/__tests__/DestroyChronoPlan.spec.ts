import { MockRuntimeError } from '@jamashita/anden-error';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import sinon, { SinonSpy } from 'sinon';
import { MockChrono } from '../../Mock/MockChrono.js';
import { DestroyChronoPlan } from '../DestroyChronoPlan.js';

describe('DestroyChronoPlan', () => {
  describe('onDestroy', () => {
    it('invokes third callback', () => {
      expect.assertions(4);

      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: MockChrono<number, MockRuntimeError> = new MockChrono<number, MockRuntimeError>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (v: unknown) => {
          spy3();
          expect(v).toBe(value);
        },
        new Set<DeadConstructor<MockRuntimeError>>()
      );
      const plan: DestroyChronoPlan<number, MockRuntimeError> = DestroyChronoPlan.of<number, MockRuntimeError>(chrono);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
