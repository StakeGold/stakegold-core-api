import { FarmState } from './farm.state';
export interface FarmStakingGroupContract {
    groupId: string;
    childContracts: ChildFarmStakingContract[];
}
export interface ChildFarmStakingContract {
    farmAddress: string;
    farmTokenId: string;
    farmingTokenId: string;
    rewardTokenId: string;
    areRewardsLocked: boolean;
    state?: FarmState;
}
