import BigNumber from "bignumber.js";
import { InputTokenModel } from "./inputToken.model";
export declare class TransactionArgs {
    tokens: InputTokenModel[];
}
export declare class StakingArgs extends TransactionArgs {
    lockRewards: boolean;
}
export declare class UnstakingArgs extends TransactionArgs {
    value: BigNumber;
}
