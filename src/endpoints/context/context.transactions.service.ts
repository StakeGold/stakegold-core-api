import {
  Address,
  BigUIntValue,
  BytesValue,
  ContractFunction,
  SmartContract,
  TypedValue,
  U32Value,
} from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import { InputToken } from '../../models/staking/inputToken.model';
import { Transaction } from '../../models/staking/transaction.model';

export class ContextTransactionsService {
  multiESDTNFTTransfer(
    sender: Address,
    contract: SmartContract,
    tokens: InputToken[],
    funcName: string,
    args: TypedValue[],
    gasLimit: number,
    chainId: string,
  ): Transaction {
    const receiverAddress = contract.getAddress();
    const transactionArgs: TypedValue[] = [];
    transactionArgs.push(BytesValue.fromHex(Address.fromBech32(receiverAddress.bech32()).hex()));

    transactionArgs.push(new U32Value(tokens.length));
    for (const token of tokens) {
      transactionArgs.push(BytesValue.fromUTF8(token.identifier));
      transactionArgs.push(new U32Value(token.nonce));
      transactionArgs.push(new BigUIntValue(new BigNumber(token.amount)));
    }

    transactionArgs.push(BytesValue.fromUTF8(funcName));
    transactionArgs.push(...args);

    const transaction = contract.call({
      func: new ContractFunction('MultiESDTNFTTransfer'),
      args: transactionArgs,
      gasLimit: gasLimit,
      chainID: chainId,
    });

    return {
      ...transaction.toPlainObject(),
      receiver: sender.bech32(),
      chainID: chainId,
    };
  }

  nftTransfer(
    sender: Address,
    contract: SmartContract,
    token: InputToken,
    funcName: string,
    args: TypedValue[],
    gasLimit: number,
    chainId: string,
  ): Transaction {
    const receiverAddress = contract.getAddress();

    const transactionArgs = [
      BytesValue.fromUTF8(token.identifier),
      new U32Value(token.nonce),
      new BigUIntValue(new BigNumber(token.amount)),
      BytesValue.fromHex(Address.fromBech32(receiverAddress.bech32()).hex()),
      BytesValue.fromUTF8(funcName),
      ...args,
    ];

    const transaction = contract.call({
      func: new ContractFunction('ESDTNFTTransfer'),
      args: transactionArgs,
      gasLimit: gasLimit,
      chainID: chainId,
    });

    return {
      ...transaction.toPlainObject(),
      receiver: sender.bech32(),
      chainID: chainId,
    };
  }

  esdtTransfer(
    contract: SmartContract,
    token: InputToken,
    funcName: string,
    args: TypedValue[],
    gasLimit: number,
    chainId: string,
  ): Transaction {
    const receiverAddress = contract.getAddress();

    const transactionArgs = [
      BytesValue.fromUTF8(token.identifier),
      new BigUIntValue(new BigNumber(token.amount)),
      BytesValue.fromUTF8(funcName),
      ...args,
    ];

    const transaction = contract.call({
      func: new ContractFunction('ESDTTransfer'),
      args: transactionArgs,
      gasLimit: gasLimit,
      chainID: chainId,
    });

    return {
      ...transaction.toPlainObject(),
      receiver: receiverAddress.bech32(),
      chainID: chainId,
    };
  }
}
