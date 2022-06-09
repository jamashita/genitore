import { Constructor } from '@jamashita/anden-type';

export type DeadConstructor<in out E extends Error = Error> = Constructor<E>;
