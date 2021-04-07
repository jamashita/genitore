import { DestroyPlan } from './DestroyPlan';
import { MapPlan } from './MapPlan';
import { RecoveryPlan } from './RecoveryPlan';

export interface Plan<M, R, N extends string = string> extends MapPlan<M, N>, RecoveryPlan<R, N>, DestroyPlan<N> {
  // NOOP
}
