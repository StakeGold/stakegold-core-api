import { MetaEsdtDetailed } from "../meta-esdt/meta.esdt";
import { UnbondTokenAttributesModel } from "./stakingTokenAttributes.model";
export declare class UnbondFarmToken extends MetaEsdtDetailed {
    decodedAttributes?: UnbondTokenAttributesModel;
    constructor(metaEsdtDetails: MetaEsdtDetailed, decodedAttributes?: UnbondTokenAttributesModel);
}
