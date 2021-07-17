import sinon, { SinonSpy } from 'sinon';
import { PassThroughPlan } from '../../../plan/PassThroughPlan';
import { CombinedEpoquePlan } from '../CombinedEpoquePlan';

describe('CombinedEpoquePlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      expect.assertions(4);

      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

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
      expect.assertions(3);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

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
      expect.assertions(4);

      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

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
