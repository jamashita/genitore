import { Suspicious } from '@jamashita/anden-type';
import { Matter } from './Matter';

export type Ymy<T> = Suspicious<Matter<T>>;
