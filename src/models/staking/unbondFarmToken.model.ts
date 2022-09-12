import { MetaEsdtDetailed } from "../meta-esdt/meta.esdt";
import { StakingTokenType, UnbondTokenAttributesModel } from "./stakingTokenAttributes.model";

export interface UnbondFarmToken extends MetaEsdtDetailed {
    readonly stakingTokenType: StakingTokenType.UNBOND_FARM_TOKEN;
    decodedAttributes?: UnbondTokenAttributesModel;
}
