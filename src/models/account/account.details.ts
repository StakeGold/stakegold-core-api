import { LockedToken, MetaEsdt } from "../meta-esdt/meta.esdt";
import { EsdtToken } from "./esdtToken.model";

export class AccountDetails {
    egldBalance: string = "0";
    esdtTokens: EsdtToken[] = [];
    lockedTokens: Map<string, LockedToken[]> = new Map();
    farmTokens: MetaEsdt[] = [];

    constructor(init?: Partial<AccountDetails>) {
        Object.assign(this, init);
    }
}
