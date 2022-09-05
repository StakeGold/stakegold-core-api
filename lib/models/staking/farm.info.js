"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsModel = exports.FarmInfo = void 0;
class FarmInfo {
}
exports.FarmInfo = FarmInfo;
class RewardsModel {
    constructor(address, rewardsToken, farmToken) {
        this.address = address;
        this.farmToken = farmToken;
        this.rewardsToken = rewardsToken;
    }
}
exports.RewardsModel = RewardsModel;
//# sourceMappingURL=farm.info.js.map