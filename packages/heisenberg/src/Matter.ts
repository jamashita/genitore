import { Nihil } from './Nihil';

export type Matter<T> = Exclude<T, Nihil>;
