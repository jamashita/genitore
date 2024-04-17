import type { DestroyPlan } from './Destroy/DestroyPlan.js';
import type { MapPlan } from './Map/MapPlan.js';
import type { RecoveryPlan } from './Recovery/RecoveryPlan.js';

export interface Plan<out M, out R> extends MapPlan<M>, RecoveryPlan<R>, DestroyPlan {
  // NOOP
}
