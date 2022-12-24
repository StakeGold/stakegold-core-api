import { LockedTokenCollection, MetaEsdtDetailed } from '../meta-esdt';
import { FarmStakingGroupContract } from '../staking';
import { EsdtToken } from './esdtToken.model';

export interface AccountDetails {
  address: string;
  egldBalance: string;
  esdtTokens: EsdtToken[];
  lockedTokens: LockedTokenCollection[];
  farmTokens: MetaEsdtDetailed[];
  farmStakingGroups: FarmStakingGroupContract[];
}
