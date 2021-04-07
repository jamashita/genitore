import { DestroySpoilPlan } from '../DestroySpoilPlan';

describe('DestroySpoilPlan', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(DestroySpoilPlan.of()).toBe(DestroySpoilPlan.of());
    });
  });
});
