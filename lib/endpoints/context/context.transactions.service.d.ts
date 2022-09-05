import { Address, SmartContract, TypedValue } from "@elrondnetwork/erdjs/out";
import { InputTokenModel } from "../../models/staking/inputToken.model";
import { TransactionModel } from "../../models/staking/transaction.model";
export declare class ContextTransactionsService {
    multiESDTNFTTransfer(sender: Address, contract: SmartContract, tokens: InputTokenModel[], funcName: string, args: TypedValue[], gasLimit: number, chainId: string): TransactionModel;
    nftTransfer(sender: Address, contract: SmartContract, token: InputTokenModel, funcName: string, args: TypedValue[], gasLimit: number, chainId: string): TransactionModel;
    esdtTransfer(contract: SmartContract, token: InputTokenModel, funcName: string, args: TypedValue[], gasLimit: number, chainId: string): TransactionModel;
}
