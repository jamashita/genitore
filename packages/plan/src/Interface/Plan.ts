import { DestroyPlan } from '../Destroy/DestroyPlan.js';
import { MapPlan } from '../Map/MapPlan.js';
import { RecoveryPlan } from '../Recovery/RecoveryPlan.js';

export interface Plan<M, R, N extends string = string> extends MapPlan<M, N>, RecoveryPlan<R, N>, DestroyPlan<N> {
  // NOOP
}
