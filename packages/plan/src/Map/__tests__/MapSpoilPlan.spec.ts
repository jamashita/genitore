import { MapSpoilPlan } from '../MapSpoilPlan';

describe('MapSpoilPlan', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect(MapSpoilPlan.of()).toBe(MapSpoilPlan.of());
    });
  });
});
