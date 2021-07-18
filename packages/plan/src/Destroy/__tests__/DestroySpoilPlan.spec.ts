import { DestroySpoilPlan } from '../DestroySpoilPlan.js';

describe('DestroySpoilPlan', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(DestroySpoilPlan.of()).toBe(DestroySpoilPlan.of());
    });
  });
});
