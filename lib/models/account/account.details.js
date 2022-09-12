"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDetails = void 0;
class AccountDetails {
    constructor(init) {
        this.egldBalance = "0";
        this.esdtTokens = [];
        this.lockedTokens = new Map();
        this.farmTokens = [];
        Object.assign(this, init);
    }
}
exports.AccountDetails = AccountDetails;
//# sourceMappingURL=account.details.js.map