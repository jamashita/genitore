import { Constructor } from '@jamashita/publikum-type';

export type DeadConstructor<E extends Error = Error> = Constructor<E>;
