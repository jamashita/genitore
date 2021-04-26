import { Detoxicated } from './Detoxicated';

export type Bdb<T> = Detoxicated<T> | Error;
