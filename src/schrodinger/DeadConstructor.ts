import { Constructor } from '@jamashita/anden/type';

export type DeadConstructor<out E extends Error = Error> = Constructor<E>;
