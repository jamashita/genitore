import { DestroyPlan } from './Destroy/DestroyPlan';
import { MapPlan } from './Map/MapPlan';
import { RecoveryPlan } from './Recovery/RecoveryPlan';

export interface Plan<out M, out R> extends MapPlan<M>, RecoveryPlan<R>, DestroyPlan {
  // NOOP
}
