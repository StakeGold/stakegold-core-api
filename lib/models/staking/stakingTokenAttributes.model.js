"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnbondTokenAttributesModel = exports.StakingTokenAttributesModel = exports.StakingTokenType = void 0;
const out_1 = require("@elrondnetwork/erdjs/out");
var StakingTokenType;
(function (StakingTokenType) {
    StakingTokenType["STAKING_FARM_TOKEN"] = "stakingFarmToken";
    StakingTokenType["UNBOND_FARM_TOKEN"] = "unboundFarmToken";
})(StakingTokenType = exports.StakingTokenType || (exports.StakingTokenType = {}));
class StakingTokenAttributesModel {
    constructor(init) {
        Object.assign(this, init);
    }
    toJSON() {
        return {
            rewardPerShare: this.rewardPerShare,
            compoundedReward: this.compoundedReward,
            currentFarmAmount: this.currentFarmAmount,
        };
    }
    static fromDecodedAttributes(decodedAttributes) {
        return new StakingTokenAttributesModel({
            rewardPerShare: decodedAttributes.rewardPerShare.toFixed(),
            compoundedReward: decodedAttributes.compoundedReward.toFixed(),
            currentFarmAmount: decodedAttributes.currentFarmAmount.toFixed(),
        });
    }
    static getStructure() {
        return new out_1.StructType('StakingFarmTokenAttributes', [
            new out_1.FieldDefinition('rewardPerShare', '', new out_1.BigUIntType()),
            new out_1.FieldDefinition('compoundedReward', '', new out_1.BigUIntType()),
            new out_1.FieldDefinition('currentFarmAmount', '', new out_1.BigUIntType()),
        ]);
    }
}
exports.StakingTokenAttributesModel = StakingTokenAttributesModel;
class UnbondTokenAttributesModel {
    constructor(init) {
        this.type = StakingTokenType.UNBOND_FARM_TOKEN;
        Object.assign(this, init);
    }
    toJSON() {
        return {
            type: this.type,
            unlockEpoch: this.remainingEpochs,
        };
    }
    static getStructure() {
        return new out_1.StructType('UnboundFarmTokenAttributes', [
            new out_1.FieldDefinition('unlockEpoch', '', new out_1.U64Type()),
        ]);
    }
}
exports.UnbondTokenAttributesModel = UnbondTokenAttributesModel;
//# sourceMappingURL=stakingTokenAttributes.model.js.map