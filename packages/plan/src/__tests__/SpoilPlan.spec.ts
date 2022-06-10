import { SpoilPlan } from '../SpoilPlan';

describe('SpoilPlan', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect(SpoilPlan.of()).toBe(SpoilPlan.of());
    });
  });
});
