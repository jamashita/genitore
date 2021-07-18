import { RecoverySpoilPlan } from '../RecoverySpoilPlan.js';

describe('RecoverySpoilPlan', () => {
  describe('of', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(RecoverySpoilPlan.of<unknown>()).toBe(RecoverySpoilPlan.of<unknown>());
    });
  });
});
