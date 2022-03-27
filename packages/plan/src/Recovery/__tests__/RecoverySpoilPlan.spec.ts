import { RecoverySpoilPlan } from '../RecoverySpoilPlan';

describe('RecoverySpoilPlan', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect(RecoverySpoilPlan.of()).toBe(RecoverySpoilPlan.of());
    });
  });
});
