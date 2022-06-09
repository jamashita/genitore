import { DestroyPlan } from './Destroy/DestroyPlan';
import { MapPlan } from './Map/MapPlan';
import { RecoveryPlan } from './Recovery/RecoveryPlan';

export interface Plan<in out M, in out R> extends MapPlan<M>, RecoveryPlan<R>, DestroyPlan {
  // NOOP
}
