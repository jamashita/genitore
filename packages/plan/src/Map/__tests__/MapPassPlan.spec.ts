import { SinonSpy, spy } from 'sinon';
import { MapPassPlan } from '../MapPassPlan';

describe('MapPassPlan', () => {
  describe('onMap', () => {
    it('invokes callback when onMap() called', () => {
      expect.assertions(2);

      const value: number = -35;

      const s: SinonSpy = spy();

      const plan: MapPassPlan<number> = MapPassPlan.of<number>(
        (v: number) => {
          s();
          expect(v).toBe(value);
        }
      );

      plan.onMap(value);

      expect(s.called).toBe(true);
    });
  });
});
