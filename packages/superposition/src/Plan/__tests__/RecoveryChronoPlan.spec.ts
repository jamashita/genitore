import { MockRuntimeError } from '@jamashita/anden-error';
import { DeadConstructor } from '@jamashita/genitore-schrodinger';
import sinon, { SinonSpy } from 'sinon';
import { MockChrono } from '../../Mock/MockChrono.js';
import { RecoveryChronoPlan } from '../RecoveryChronoPlan.js';

describe('RecoveryChronoPlan', () => {
  describe('onRecover', () => {
    it('invokes second callback', () => {
      expect.assertions(4);

      const value: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

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
