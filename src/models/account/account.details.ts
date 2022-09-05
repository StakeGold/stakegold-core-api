import { ApiProperty } from "@nestjs/swagger";
import { LockedToken, MetaEsdt } from "../meta-esdt/meta.esdt";
import { EsdtToken } from "./esdtToken.model";

export class AccountDetails {
    @ApiProperty({ description: 'EGLD balance of the account', type: String })
    egldBalance: string = "0";

    @ApiProperty({ description: 'ESDT tokens owned by the account', type: EsdtToken, isArray: true })
    esdtTokens: EsdtToken[] = [];

    @ApiProperty({ description: 'Locked tokens owned by this account', type: LockedToken, isArray: true })
    lockedTokens: Map<string, LockedToken[]> = new Map();

    @ApiProperty({ description: 'Farm tokens owned by this account', type: MetaEsdt, isArray: true })
    farmTokens: MetaEsdt[] = [];

    constructor(init?: Partial<AccountDetails>) {
        Object.assign(this, init);
    }
}
