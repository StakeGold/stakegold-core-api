"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnstakingArgs = exports.StakingArgs = exports.TransactionArgs = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
class TransactionArgs {
    constructor() {
        this.tokens = [];
    }
}
exports.TransactionArgs = TransactionArgs;
class StakingArgs extends TransactionArgs {
    constructor() {
        super(...arguments);
        this.lockRewards = false;
    }
}
exports.StakingArgs = StakingArgs;
class UnstakingArgs extends TransactionArgs {
    constructor() {
        super(...arguments);
        this.value = new bignumber_js_1.default(0);
    }
}
exports.UnstakingArgs = UnstakingArgs;
//# sourceMappingURL=staking.args.js.map