import { UnlockMilestone } from "../account/LockedAssetAttributes";
import { EsdtType } from "./esdt.type";

export interface MetaEsdt {
  identifier: string;
  collection: string;
  attributes: string;
  nonce: number;
  type: EsdtType;
  balance: string | undefined;
}

export interface MetaEsdtDetailed extends MetaEsdt {
  timestamp?: number;
  name: string;
  creator: string;
  isWhitelistedStorage: boolean;
  decimals: number | undefined;
  ticker?: string;
  assets?: any;
}

export class LockedToken {
  identifier: string = "";
  nonce: number = 0;
  name: string = "";
  collection: string = "";
  balance: string = "0";
  decimals: number | undefined = undefined;
  ticker?: string = "";
  unlockSchedule: UnlockMilestone[] = [];
  assets?: any;

  constructor(init?: Partial<LockedToken>) {
    Object.assign(this, init);
  }

  static fromMetaEsdt(
    esdt: MetaEsdtDetailed,
    unlockSchedule: UnlockMilestone[] | undefined
  ): LockedToken {
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
