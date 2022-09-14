import { EsdtToken } from '../account';
import { NftCollection } from '../meta-esdt';
import { MetaEsdtDetailed } from '../meta-esdt/meta.esdt';
import { FarmAddresses } from './farm.address';

export interface Farm {
  farmAddresses: FarmAddresses;
  farmingToken: NftCollection | EsdtToken;
  groupId: string;
  farmTotalSupply: string;
  apr?: number;
  lockedApr?: number;
  accumulatedRewards: string;
  accumulatedStakings: string;
  positions: Position[];
}

export interface Position {
  farmToken: MetaEsdtDetailed;
  rewardToken: NftCollection | EsdtToken;
}
