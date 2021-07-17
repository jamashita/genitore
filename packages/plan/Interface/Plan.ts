import { DestroyPlan } from './DestroyPlan.js';
import { MapPlan } from './MapPlan.js';
import { RecoveryPlan } from './RecoveryPlan.js';

export interface Plan<M, R, N extends string = string> extends MapPlan<M, N>, RecoveryPlan<R, N>, DestroyPlan<N> {
  // NOOP
}
