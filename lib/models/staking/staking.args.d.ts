import { InputToken } from './inputToken.model';
export interface TransactionArgs {
    tokens: InputToken[];
}
export interface StakingArgs extends TransactionArgs {
    lockRewards: boolean;
}
export interface UnstakingArgs extends TransactionArgs {
    value: string;
}
