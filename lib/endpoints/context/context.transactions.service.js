"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextTransactionsService = void 0;
const tslib_1 = require("tslib");
const out_1 = require("@elrondnetwork/erdjs/out");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
class ContextTransactionsService {
    multiESDTNFTTransfer(sender, contract, tokens, funcName, args, gasLimit, chainId) {
        const receiverAddress = contract.getAddress();
        const transactionArgs = [];
        transactionArgs.push(out_1.BytesValue.fromHex(out_1.Address.fromBech32(receiverAddress.bech32()).hex()));
        transactionArgs.push(new out_1.U32Value(tokens.length));
        for (const token of tokens) {
            transactionArgs.push(out_1.BytesValue.fromUTF8(token.identifier));
            transactionArgs.push(new out_1.U32Value(token.nonce));
            transactionArgs.push(new out_1.BigUIntValue(new bignumber_js_1.default(token.amount)));
        }
        transactionArgs.push(out_1.BytesValue.fromUTF8(funcName));
        transactionArgs.push(...args);
        const transaction = contract.call({
            func: new out_1.ContractFunction('MultiESDTNFTTransfer'),
            args: transactionArgs,
            gasLimit: gasLimit,
            chainID: chainId,
        });
        return Object.assign(Object.assign({}, transaction.toPlainObject()), { receiver: sender.bech32(), chainID: chainId });
    }
    nftTransfer(sender, contract, token, funcName, args, gasLimit, chainId) {
        const receiverAddress = contract.getAddress();
        const transactionArgs = [
            out_1.BytesValue.fromUTF8(token.identifier),
            new out_1.U32Value(token.nonce),
            new out_1.BigUIntValue(new bignumber_js_1.default(token.amount)),
            out_1.BytesValue.fromHex(out_1.Address.fromBech32(receiverAddress.bech32()).hex()),
            out_1.BytesValue.fromUTF8(funcName),
            ...args,
        ];
        const transaction = contract.call({
            func: new out_1.ContractFunction('ESDTNFTTransfer'),
            args: transactionArgs,
            gasLimit: gasLimit,
            chainID: chainId,
        });
        return Object.assign(Object.assign({}, transaction.toPlainObject()), { receiver: sender.bech32(), chainID: chainId });
    }
    esdtTransfer(contract, token, funcName, args, gasLimit, chainId) {
        const receiverAddress = contract.getAddress();
        const transactionArgs = [
            out_1.BytesValue.fromUTF8(token.identifier),
            new out_1.BigUIntValue(new bignumber_js_1.default(token.amount)),
            out_1.BytesValue.fromUTF8(funcName),
            ...args,
        ];
        const transaction = contract.call({
            func: new out_1.ContractFunction('ESDTTransfer'),
            args: transactionArgs,
            gasLimit: gasLimit,
            chainID: chainId,
        });
        return Object.assign(Object.assign({}, transaction.toPlainObject()), { receiver: receiverAddress.bech32(), chainID: chainId });
    }
}
exports.ContextTransactionsService = ContextTransactionsService;
//# sourceMappingURL=context.transactions.service.js.map