import { EsdtToken } from '../account';
import { NftCollection } from '../meta-esdt';
import { MetaEsdtDetailed } from '../meta-esdt/meta.esdt';
import { FarmStaking } from './farm.address';
export interface FarmGroup {
    groupId: string;
    groupTotalSupply: string;
    lowestApr?: number;
    highestApr?: number;
    accumulatedRewards: string;
    accumulatedStakings: string;
    groupName?: string;
    groupDecimals: number;
    groupIcon?: string;
    farmingToken?: NftCollection | EsdtToken;
    farms: Farm[];
}
export interface Farm {
    farmStaking: FarmStaking;
    farmingToken: NftCollection | EsdtToken;
    apr?: number;
    lockedApr?: number;
    lockedRewardToken?: NftCollection | EsdtToken;
    unlockedRewardToken?: NftCollection | EsdtToken;
    positions: Position[];
}
export interface Position {
    farmToken: MetaEsdtDetailed;
    rewardToken: NftCollection | EsdtToken;
}
