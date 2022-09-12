"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockedToken = void 0;
class LockedToken {
    constructor(init) {
        this.identifier = '';
        this.nonce = 0;
        this.name = '';
        this.collection = '';
        this.balance = '0';
        this.decimals = undefined;
        this.ticker = '';
        this.unlockSchedule = [];
        Object.assign(this, init);
    }
    static fromMetaEsdt(esdt, unlockSchedule) {
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
exports.LockedToken = LockedToken;
//# sourceMappingURL=meta.esdt.js.map