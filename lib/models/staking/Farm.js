"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = exports.Farm = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const farm_address_1 = require("./farm.address");
const stake_token_model_1 = require("./stake.token.model");
class Farm {
    constructor(init) {
        this.addresses = new farm_address_1.FarmAddress();
        this.farmingToken = new stake_token_model_1.StakeTokenModel();
        this.farmTotalSupply = new bignumber_js_1.default(0);
        this.apr = 0;
        this.lockedApr = 0;
        this.accumulatedRewards = new bignumber_js_1.default(0);
        this.accumulatedStakings = new bignumber_js_1.default(0);
        this.positions = [];
        Object.assign(this, init);
    }
}
exports.Farm = Farm;
class Position {
    constructor(farmToken, rewardToken) {
        this.farmToken = farmToken;
        this.rewardToken = rewardToken;
    }
}
exports.Position = Position;
//# sourceMappingURL=Farm.js.map