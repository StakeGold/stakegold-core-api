import { Assets } from '../account';
import { UnlockMilestone } from '../account/LockedAssetAttributes';
import { EsdtType } from './esdt.type';
export interface MetaEsdt {
    identifier: string;
    collection: string;
    attributes: string;
    nonce: number;
    type: EsdtType;
    balance: string | undefined;
}
export interface MetaEsdtDetailed extends MetaEsdt {
    timestamp?: number;
    name: string;
    creator: string;
    isWhitelistedStorage: boolean;
    decimals: number | undefined;
    ticker?: string;
    assets?: Assets;
}
export interface LockedToken {
    identifier: string;
    nonce: number;
    name: string;
    collection: string;
    balance: string;
    decimals?: number;
    ticker?: string;
    unlockSchedule: UnlockMilestone[];
    assets?: Assets;
}
export interface LockedTokenCollection {
    collection: string;
    tokens: LockedToken[];
}
