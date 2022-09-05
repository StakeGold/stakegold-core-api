import BigNumber from "bignumber.js";
import { InputTokenModel } from "./inputToken.model";
export class TransactionArgs {
  tokens: InputTokenModel[] = [];
}
export class StakingArgs extends TransactionArgs {
  lockRewards = false;
}

export class UnstakingArgs extends TransactionArgs {
  value = new BigNumber(0);
}
