import { StakeTokenModel } from "./stake.token.model";
export declare class FarmInfo {
    unlockedRewards?: RewardsModel;
    lockedRewards?: RewardsModel;
    farmingToken?: StakeTokenModel;
}
export declare class RewardsModel {
    address: string;
    rewardsToken: StakeTokenModel;
    farmToken: string;
    constructor(address: string, rewardsToken: StakeTokenModel, farmToken: string);
}
