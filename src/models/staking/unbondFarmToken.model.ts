import { MetaEsdtDetailed } from "../meta-esdt/meta.esdt";
import { UnbondTokenAttributesModel } from "./stakingTokenAttributes.model";

export class UnbondFarmToken extends MetaEsdtDetailed {
    decodedAttributes?: UnbondTokenAttributesModel;

    constructor (metaEsdtDetails: MetaEsdtDetailed, decodedAttributes?: UnbondTokenAttributesModel) {
        super(metaEsdtDetails);
        this.decodedAttributes = decodedAttributes;
    }
}
