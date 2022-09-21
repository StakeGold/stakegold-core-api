"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStakeFarmToken = void 0;
const stakingTokenAttributes_model_1 = require("./stakingTokenAttributes.model");
function isStakeFarmToken(object) {
    var _a;
    return ((_a = object.decodedAttributes) === null || _a === void 0 ? void 0 : _a.type) === stakingTokenAttributes_model_1.StakingTokenType.STAKING_FARM_TOKEN;
}
exports.isStakeFarmToken = isStakeFarmToken;
//# sourceMappingURL=stakeFarmToken.model.js.map