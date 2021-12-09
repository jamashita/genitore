import { DestroySpoilPlan } from '../DestroySpoilPlan';

describe('DestroySpoilPlan', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect(DestroySpoilPlan.of()).toBe(DestroySpoilPlan.of());
    });
  });
});
