import { MetaEsdtDetailed } from "../meta-esdt/meta.esdt";
import { StakingTokenAttributesModel } from "./stakingTokenAttributes.model";
export declare class StakeFarmToken extends MetaEsdtDetailed {
    decodedAttributes?: StakingTokenAttributesModel;
    constructor(metaEsdtDetails: MetaEsdtDetailed, decodedAttributes?: StakingTokenAttributesModel);
}
