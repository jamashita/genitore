import { RecoverySpoilPlan } from '../RecoverySpoilPlan';

describe('RecoverySpoilPlan', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect(RecoverySpoilPlan.of<unknown>()).toBe(RecoverySpoilPlan.of<unknown>());
    });
  });
});
