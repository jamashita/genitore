import { Nihil } from './Nihil.js';

export type Matter<T> = Exclude<T, Nihil>;
