import { SyncAsync } from '@jamashita/anden-type';
import { Nihil } from './Nihil';

export type Matter<T> = Exclude<T, SyncAsync<Nihil>>;
