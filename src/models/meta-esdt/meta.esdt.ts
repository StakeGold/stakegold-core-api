import { ApiProperty } from "@nestjs/swagger";
import { UnlockMilestone } from "../account/LockedAssetAttributes";
import { EsdtType } from "./esdt.type";

export class MetaEsdt {
  @ApiProperty({ type: String })
  identifier: string = '';

  @ApiProperty({ type: String })
  collection: string = '';

  @ApiProperty({ type: String })
  attributes: string = '';

  @ApiProperty({ type: Number })
  nonce: number = 0;

  @ApiProperty({ enum: EsdtType })
  type: EsdtType = EsdtType.MetaESDT;

  @ApiProperty({ type: String, nullable: true })
  balance: string | undefined = undefined;

  constructor(init: MetaEsdtDetailed) {
    this.identifier = init.identifier;
    this.collection = init.collection;
    this.attributes = init.attributes;
    this.nonce = init.nonce;
    this.type = init.type;
    this.balance = init.balance;
  }
}

export class MetaEsdtDetailed extends MetaEsdt {

  @ApiProperty({ type: Number, nullable: true })
  timestamp?: number = undefined;

  @ApiProperty({ type: String })
  name: string = '';

  @ApiProperty({ type: String })
  creator: string = '';

  @ApiProperty({ type: Boolean, default: false })
  isWhitelistedStorage: boolean = false;

  @ApiProperty({ type: Number, nullable: true })
  decimals: number | undefined = undefined;

  @ApiProperty({ type: String })
  ticker?: string = '';

  @ApiProperty()
  assets?: any;

  constructor(init: MetaEsdtDetailed) {
    super(init);
    this.timestamp = init.timestamp;
    this.name = init.name;
    this.creator = init.creator;
    this.isWhitelistedStorage = init.isWhitelistedStorage;
    this.decimals = init.decimals;
    this.ticker = init.ticker;
    this.assets = init.assets;
  }
}
export class LockedToken {
  @ApiProperty({ type: String })
  identifier: string = '';

  @ApiProperty({ type: Number })
  nonce: number = 0;

  @ApiProperty({ type: String })
  name: string = '';

  @ApiProperty({ type: String })
  collection: string = '';

  @ApiProperty({ type: String, nullable: true })
  balance: string = '0';

  @ApiProperty({ type: Number, nullable: true })
  decimals: number | undefined = undefined;

  @ApiProperty({ type: String })
  ticker?: string = '';

  @ApiProperty({ type: UnlockMilestone, isArray: true })
  unlockSchedule: UnlockMilestone[] = [];

  @ApiProperty()
  assets?: any;

  constructor(init?: Partial<LockedToken>) {
    Object.assign(this, init);
  }

  static fromMetaEsdt(esdt: MetaEsdtDetailed, unlockSchedule: UnlockMilestone[] | undefined): LockedToken {
    return new LockedToken({
      ticker: esdt.ticker,
      collection: esdt.collection,
      identifier: esdt.identifier,
      name: esdt.name,
      nonce: esdt.nonce,
      balance: esdt.balance,
      decimals: esdt.decimals,
      assets: esdt.assets,
      unlockSchedule,
    });
  }
}
