import { MockRuntimeError } from '@jamashita/publikum-error';
import sinon, { SinonSpy } from 'sinon';
import { PassThroughPlan } from '../../../../plan/src/PassThroughPlan';
import { CombinedChronoPlan } from '../CombinedChronoPlan';

describe('CombinedChronoPlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      expect.assertions(4);

      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughPlan<number, MockRuntimeError> = PassThroughPlan.of<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );
      const plan: CombinedChronoPlan<number, MockRuntimeError> = CombinedChronoPlan.of<number, MockRuntimeError>(pass, pass, pass);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onRecover', () => {
    it('invokes second callback', () => {
      expect.assertions(4);

      const value: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughPlan<number, MockRuntimeError> = PassThroughPlan.of<number, MockRuntimeError>(
        () => {
          spy1();
        },
        (v: MockRuntimeError) => {
          spy2();
          expect(v).toBe(value);
        },
        () => {
          spy3();
        }
      );
      const plan: CombinedChronoPlan<number, MockRuntimeError> = CombinedChronoPlan.of<number, MockRuntimeError>(pass, pass, pass);

      plan.onRecover(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onDestroy', () => {
    it('invokes third callback', () => {
      expect.assertions(4);

      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughPlan<number, MockRuntimeError> = PassThroughPlan.of<number, MockRuntimeError>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (v: unknown) => {
          spy3();
          expect(v).toBe(value);
        }
      );
      const plan: CombinedChronoPlan<number, MockRuntimeError> = CombinedChronoPlan.of<number, MockRuntimeError>(pass, pass, pass);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
