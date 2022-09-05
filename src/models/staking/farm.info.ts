import { StakeTokenModel } from "./stake.token.model";

export class FarmInfo {
    unlockedRewards?: RewardsModel;
    lockedRewards?: RewardsModel;
    farmingToken?: StakeTokenModel;
}

export class RewardsModel {
    address: string;
    rewardsToken: StakeTokenModel;
    farmToken: string;

    constructor(address : string, rewardsToken: StakeTokenModel, farmToken: string) {
        this.address = address;
        this.farmToken = farmToken;
        this.rewardsToken = rewardsToken;
    }
}
