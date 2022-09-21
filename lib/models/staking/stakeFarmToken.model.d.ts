import { MetaEsdtDetailed } from '../meta-esdt/meta.esdt';
import { StakingTokenAttributesModel } from './stakingTokenAttributes.model';
export interface StakeFarmToken extends MetaEsdtDetailed {
    decodedAttributes?: StakingTokenAttributesModel;
}
export declare function isStakeFarmToken(object: any): object is StakeFarmToken;
