import { LockedToken, MetaEsdt } from "../meta-esdt/meta.esdt";
import { EsdtToken } from "./esdtToken.model";
export declare class AccountDetails {
    egldBalance: string;
    esdtTokens: EsdtToken[];
    lockedTokens: Map<string, LockedToken[]>;
    farmTokens: MetaEsdt[];
    constructor(init?: Partial<AccountDetails>);
}
