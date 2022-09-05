"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsModuleOptions = void 0;
class AccountsModuleOptions {
    constructor(esdtTokens, metaEsdtCollection, farmTokens) {
        this.esdtTokens = [];
        this.metaEsdtCollection = [];
        this.farmTokens = new Map();
        this.esdtTokens = esdtTokens;
        this.metaEsdtCollection = metaEsdtCollection;
        this.farmTokens = farmTokens;
    }
    getFarmTokensAddresses() {
        return Array.from(Object.keys(this.farmTokens));
    }
}
exports.AccountsModuleOptions = AccountsModuleOptions;
//# sourceMappingURL=account.module.options.js.map