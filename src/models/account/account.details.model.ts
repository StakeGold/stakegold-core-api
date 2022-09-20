import { LockedTokenCollection, MetaEsdtDetailed } from '../meta-esdt';
import { EsdtToken } from './esdtToken.model';

export interface AccountDetails {
  address: string;
  egldBalance: string;
  esdtTokens: EsdtToken[];
  lockedTokens: LockedTokenCollection[];
  farmTokens: MetaEsdtDetailed[];
}
