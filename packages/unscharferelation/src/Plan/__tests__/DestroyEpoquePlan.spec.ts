import sinon, { SinonSpy } from 'sinon';
import { MockEpoque } from '../../Mock/MockEpoque.js';
import { DestroyEpoquePlan } from '../DestroyEpoquePlan.js';

describe('DestroyEpoquePlan', () => {
  describe('onDestroy', () => {
    it('invokes third callback', () => {
      expect.assertions(4);

      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: MockEpoque<number> = new MockEpoque<number>(
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
      const plan: DestroyEpoquePlan<number> = DestroyEpoquePlan.of<number>(epoque);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
