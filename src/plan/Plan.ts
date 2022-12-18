import { DestroyPlan } from './Destroy/DestroyPlan.js';
import { MapPlan } from './Map/MapPlan.js';
import { RecoveryPlan } from './Recovery/RecoveryPlan.js';

export interface Plan<out M, out R> extends MapPlan<M>, RecoveryPlan<R>, DestroyPlan {
  // NOOP
}
