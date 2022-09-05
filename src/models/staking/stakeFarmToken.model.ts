import { MetaEsdtDetailed } from "../meta-esdt/meta.esdt";
import { StakingTokenAttributesModel } from "./stakingTokenAttributes.model";

export class StakeFarmToken extends MetaEsdtDetailed {
    decodedAttributes?: StakingTokenAttributesModel;

    constructor (metaEsdtDetails: MetaEsdtDetailed, decodedAttributes?: StakingTokenAttributesModel) {
        super(metaEsdtDetails);
        this.decodedAttributes = decodedAttributes;
    }
}
