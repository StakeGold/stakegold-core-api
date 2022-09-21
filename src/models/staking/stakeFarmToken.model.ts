import { MetaEsdtDetailed } from '../meta-esdt/meta.esdt';
import { StakingTokenAttributesModel, StakingTokenType } from './stakingTokenAttributes.model';

export interface StakeFarmToken extends MetaEsdtDetailed {
  decodedAttributes?: StakingTokenAttributesModel;
}

export function isStakeFarmToken(object: any): object is StakeFarmToken {
  return object.decodedAttributes?.type === StakingTokenType.STAKING_FARM_TOKEN;
}
