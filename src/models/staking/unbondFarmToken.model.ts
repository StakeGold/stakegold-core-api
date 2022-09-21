import { MetaEsdtDetailed } from '../meta-esdt/meta.esdt';
import { UnbondTokenAttributesModel } from './stakingTokenAttributes.model';

export interface UnbondFarmToken extends MetaEsdtDetailed {
  decodedAttributes?: UnbondTokenAttributesModel;
}
