import { UnlockMilestone } from "../account/LockedAssetAttributes";
import { EsdtType } from "./esdt.type";
export declare class MetaEsdt {
    identifier: string;
    collection: string;
    attributes: string;
    nonce: number;
    type: EsdtType;
    balance: string | undefined;
    constructor(init: MetaEsdtDetailed);
}
export declare class MetaEsdtDetailed extends MetaEsdt {
    timestamp?: number;
    name: string;
    creator: string;
    isWhitelistedStorage: boolean;
    decimals: number | undefined;
    ticker?: string;
    assets?: any;
    constructor(init: MetaEsdtDetailed);
}
export declare class LockedToken {
    identifier: string;
    nonce: number;
    name: string;
    collection: string;
    balance: string;
    decimals: number | undefined;
    ticker?: string;
    unlockSchedule: UnlockMilestone[];
    assets?: any;
    constructor(init?: Partial<LockedToken>);
    static fromMetaEsdt(esdt: MetaEsdtDetailed, unlockSchedule: UnlockMilestone[] | undefined): LockedToken;
}
