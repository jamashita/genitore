import { Constructor } from '@jamashita/anden-type';

export type DeadConstructor<E extends Error = Error> = Constructor<E>;
