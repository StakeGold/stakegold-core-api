import { StructType } from '@elrondnetwork/erdjs/out';
export declare type UnlockMilestoneType = {
    epoch: number | undefined;
    percent: number | undefined;
};
export declare type LockedAssetAttributesType = {
    unlockSchedule: UnlockMilestoneType[] | undefined;
    isMerged: boolean | undefined;
};
export interface UnlockMilestone {
    epoch: number;
    percent: number;
    unlockDate?: string;
}
export declare class LockedAssetAttributes {
    unlockSchedule: UnlockMilestone[] | undefined;
    isMerged: boolean | undefined;
    constructor(init?: Partial<LockedAssetAttributes>);
    static fromDecodedAttributes(decodedAttributes: any): LockedAssetAttributes;
    static fromAttributes(attributes: string): LockedAssetAttributes;
    static getStructure(): StructType;
}
