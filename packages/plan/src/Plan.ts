import { DestroyPlan } from './Destroy/DestroyPlan';
import { MapPlan } from './Map/MapPlan';
import { RecoveryPlan } from './Recovery/RecoveryPlan';

export interface Plan<M, R, N extends string = string> extends MapPlan<M, N>, RecoveryPlan<R, N>, DestroyPlan<N> {
  // NOOP
}
