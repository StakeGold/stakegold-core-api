import { StakeTokenModel } from "./stake.token.model";
export interface FarmInfo {
    unlockedRewards?: RewardsModel;
    lockedRewards?: RewardsModel;
    farmingToken?: StakeTokenModel;
}
export interface RewardsModel {
    address: string;
    rewardsToken: StakeTokenModel;
    farmToken: string;
}
