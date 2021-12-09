import { DestroyPlan } from './Destroy/DestroyPlan';
import { MapPlan } from './Map/MapPlan';
import { RecoveryPlan } from './Recovery/RecoveryPlan';

export interface Plan<M, R> extends MapPlan<M>, RecoveryPlan<R>, DestroyPlan {
  // NOOP
}
