import { MockRuntimeError } from '@jamashita/anden-error';
import { PassThroughPlan } from '@jamashita/genitore-plan';
import { SinonSpy, spy } from 'sinon';
import { CombinedChronoPlan } from '../CombinedChronoPlan';

describe('CombinedChronoPlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

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
      const value: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

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
      const value: number = -35;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

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
