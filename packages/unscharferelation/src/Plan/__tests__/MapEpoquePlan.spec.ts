import { SinonSpy, spy } from 'sinon';
import { MockEpoque } from '../../Mock/MockEpoque';
import { MapEpoquePlan } from '../MapEpoquePlan';

describe('MapEpoquePlan', () => {
  describe('onMap', () => {
    it('invokes first callback', () => {
      const value: number = -35;

      const spy1: SinonSpy = spy();
      const spy2: SinonSpy = spy();
      const spy3: SinonSpy = spy();

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
