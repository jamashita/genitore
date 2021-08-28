import { MockRuntimeError } from '@jamashita/anden-error';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import { SinonSpy, spy } from 'sinon';
import { MockChrono } from '../../Mock/MockChrono';
import { RecoveryChronoPlan } from '../RecoveryChronoPlan';

describe('RecoveryChronoPlan', () => {
  describe('onRecover', () => {
    it('invokes second callback', () => {
      expect.assertions(4);

      const value: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      const chrono: MockChrono<number, MockRuntimeError> = new MockChrono<number, MockRuntimeError>(
        () => {
          spy1();
        },
        (v: MockRuntimeError) => {
          spy2();
          expect(v).toBe(value);
        },
        () => {
          spy3();
        },
        new Set<DeadConstructor<MockRuntimeError>>()
      );
      const plan: RecoveryChronoPlan<number, MockRuntimeError> = RecoveryChronoPlan.of<number, MockRuntimeError>(chrono);

      plan.onRecover(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });
});
