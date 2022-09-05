import { ApiProperty } from "@nestjs/swagger";

export class AccountStatus {
  @ApiProperty({ description: "The amount of EGLD held by this wallet" })
  egldBalance: string = "0";
  @ApiProperty({ description: "The amount of ESDT token held by this wallet" })
  balances: string[] = [];
  @ApiProperty({ description: "How much UPARK has bought" })
  addressBuys: string = "0";
  @ApiProperty({
    description: "Flag which states if the address is whitelisted",
  })
  whitelisted: boolean = false;

  constructor(init?: Partial<AccountStatus>) {
    Object.assign(this, init);
  }
}
