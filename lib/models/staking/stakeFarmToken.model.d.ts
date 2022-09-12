import { MetaEsdtDetailed } from "../meta-esdt/meta.esdt";
import { StakingTokenAttributesModel, StakingTokenType } from "./stakingTokenAttributes.model";
export interface StakeFarmToken extends MetaEsdtDetailed {
    readonly stakingTokenType: StakingTokenType.STAKING_FARM_TOKEN;
    decodedAttributes?: StakingTokenAttributesModel;
}
