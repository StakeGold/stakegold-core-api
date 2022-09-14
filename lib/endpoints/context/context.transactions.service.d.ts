import { Address, SmartContract, TypedValue } from '@elrondnetwork/erdjs/out';
import { InputToken } from '../../models/staking/inputToken.model';
import { Transaction } from '../../models/staking/transaction.model';
export declare class ContextTransactionsService {
    multiESDTNFTTransfer(sender: Address, contract: SmartContract, tokens: InputToken[], funcName: string, args: TypedValue[], gasLimit: number, chainId: string): Transaction;
    nftTransfer(sender: Address, contract: SmartContract, token: InputToken, funcName: string, args: TypedValue[], gasLimit: number, chainId: string): Transaction;
    esdtTransfer(contract: SmartContract, token: InputToken, funcName: string, args: TypedValue[], gasLimit: number, chainId: string): Transaction;
}
