import { MapSpoilPlan } from '../MapSpoilPlan.js';

describe('MapSpoilPlan', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(MapSpoilPlan.of<unknown>()).toBe(MapSpoilPlan.of<unknown>());
    });
  });
});
