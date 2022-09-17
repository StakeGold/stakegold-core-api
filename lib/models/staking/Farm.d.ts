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
    farms: Farm[];
}
export interface Farm {
    farmStaking: FarmStaking;
    farmingToken: NftCollection | EsdtToken;
    apr?: number;
    lockedApr?: number;
    positions: Position[];
}
export interface Position {
    farmToken: MetaEsdtDetailed;
    rewardToken: NftCollection | EsdtToken;
}
