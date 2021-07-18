import sinon, { SinonSpy } from 'sinon';
import { MockEpoque } from '../../Mock/MockEpoque.js';
import { MapEpoquePlan } from '../MapEpoquePlan.js';

describe('MapEpoquePlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      expect.assertions(4);

      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: MockEpoque<number> = new MockEpoque<number>(
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
      const plan: MapEpoquePlan<number> = MapEpoquePlan.of<number>(epoque);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });
});
