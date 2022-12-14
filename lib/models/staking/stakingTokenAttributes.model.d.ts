import { StructType } from '@elrondnetwork/erdjs/out';
export declare enum StakingTokenType {
    STAKING_FARM_TOKEN = "stakingFarmToken",
    UNBOND_FARM_TOKEN = "unboundFarmToken"
}
export declare class StakingTokenAttributesModel {
    identifier?: string;
    attributes?: string;
    rewardPerShare?: string;
    compoundedReward?: string;
    currentFarmAmount?: string;
    type: StakingTokenType;
    constructor(init?: Partial<StakingTokenAttributesModel>);
    toJSON(): {
        rewardPerShare: string | undefined;
        compoundedReward: string | undefined;
        currentFarmAmount: string | undefined;
    };
    static fromDecodedAttributes(decodedAttributes: any): StakingTokenAttributesModel;
    static getStructure(): StructType;
}
export declare class UnbondTokenAttributesModel {
    identifier?: string;
    attributes?: string;
    type: StakingTokenType;
    remainingEpochs?: number;
    unlockDate?: string;
    constructor(init?: Partial<UnbondTokenAttributesModel>);
    toJSON(): {
        type: StakingTokenType;
        unlockEpoch: number | undefined;
    };
    static getStructure(): StructType;
}
