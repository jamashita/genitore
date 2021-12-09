import { PassThroughPlan } from '@jamashita/genitore-plan';
import { SinonSpy, spy } from 'sinon';
import { CombinedEpoquePlan } from '../CombinedEpoquePlan';

describe('CombinedEpoquePlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      const pass: PassThroughPlan<number, void> = PassThroughPlan.of<number, void>(
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
      const plan: CombinedEpoquePlan<number> = CombinedEpoquePlan.of<number>(pass, pass, pass);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onRecover', () => {
    it('invokes second callback', () => {
      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

      const pass: PassThroughPlan<number, void> = PassThroughPlan.of<number, void>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );
      const plan: CombinedEpoquePlan<number> = CombinedEpoquePlan.of<number>(pass, pass, pass);

      plan.onRecover();

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

      const pass: PassThroughPlan<number, void> = PassThroughPlan.of<number, void>(
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
      const plan: CombinedEpoquePlan<number> = CombinedEpoquePlan.of<number>(pass, pass, pass);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
