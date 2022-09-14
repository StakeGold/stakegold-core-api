"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingComputeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const stakingTokenAttributes_model_1 = require("../../../models/staking/stakingTokenAttributes.model");
const address_utils_1 = require("../../utils/address.utils");
const constants_1 = require("../../utils/constants");
const number_utils_1 = require("../../utils/number.utils");
const staking_getter_service_1 = require("./staking.getter.service");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
let StakingComputeService = class StakingComputeService {
    constructor(stakingGetterService, apiConfigService) {
        this.stakingGetterService = stakingGetterService;
        this.apiConfigService = apiConfigService;
    }
    async computeAnnualPercentageReward(address) {
        const perBlockRewardAmount = await this.stakingGetterService.getPerBlockRewardAmount(address);
        const farmTotalSupply = await this.stakingGetterService.getFarmTokenSupply(address);
        const maxAnnualPercentageRewards = await this.stakingGetterService.getAnnualPercentageRewards(address);
        if (perBlockRewardAmount && farmTotalSupply && maxAnnualPercentageRewards) {
            let totalSupplyNumber = new bignumber_js_1.default(farmTotalSupply);
            if (totalSupplyNumber.isLessThanOrEqualTo(new bignumber_js_1.default(0))) {
                totalSupplyNumber = new bignumber_js_1.default(1);
            }
            const result = new bignumber_js_1.default(perBlockRewardAmount)
                .multipliedBy(5256000)
                .dividedBy(totalSupplyNumber)
                .multipliedBy(100);
            return Math.min(result.toNumber(), number_utils_1.NumberUtils.denominate(BigInt(maxAnnualPercentageRewards), 2));
        }
        return undefined;
    }
    computeAccumulatedStakings(positions) {
        var _a, _b;
        let stakings = new bignumber_js_1.default(0);
        for (let i = 0; i < positions.length; i++) {
            stakings = stakings.plus(new bignumber_js_1.default((_b = (_a = positions[i].farmToken) === null || _a === void 0 ? void 0 : _a.balance) !== null && _b !== void 0 ? _b : 0));
        }
        return stakings.toFixed();
    }
    computeAccumulatedRewards(positions) {
        var _a, _b;
        let stakings = new bignumber_js_1.default(0);
        for (let i = 0; i < positions.length; i++) {
            stakings = stakings.plus(new bignumber_js_1.default((_b = (_a = positions[i].rewardToken) === null || _a === void 0 ? void 0 : _a.balance) !== null && _b !== void 0 ? _b : 0));
        }
        return stakings.toFixed();
    }
    async computePositions(farmAddress, farmTokenId, rewardToken, metaEsdts, vmQuery) {
        const metaEsdt = metaEsdts.filter((metaEsdt) => {
            return metaEsdt.collection.trim() === farmTokenId;
        });
        const promises = metaEsdt.map(async (esdt) => {
            if (esdt.balance) {
                const rewards = await this.getRewardsForPosition(farmAddress, esdt, vmQuery);
                rewardToken.balance = rewards.toFixed();
            }
            return { farmToken: esdt, rewardToken: rewardToken };
        });
        return await Promise.all(promises);
    }
    async getRewardsForPosition(stakeAddress, esdt, vmQuery) {
        var _a, _b;
        if (esdt.stakingTokenType !== stakingTokenAttributes_model_1.StakingTokenType.STAKING_FARM_TOKEN ||
            !esdt.decodedAttributes ||
            !esdt.balance ||
            !esdt.attributes) {
            return new bignumber_js_1.default(0);
        }
        const liquidity = esdt.balance;
        const attributes = esdt.attributes;
        let rewards;
        if (vmQuery) {
            rewards =
                (_a = (await this.stakingGetterService.calculateRewardsForGivenPosition(stakeAddress, liquidity, attributes))) !== null && _a !== void 0 ? _a : new bignumber_js_1.default(0);
        }
        else {
            rewards =
                (_b = (await this.computeFarmRewardsForPosition(stakeAddress, liquidity, esdt.decodedAttributes))) !== null && _b !== void 0 ? _b : new bignumber_js_1.default(0);
        }
        return rewards;
    }
    async computeFarmRewardsForPosition(farmAddress, liquidity, decodedAttributes) {
        var _a;
        const [currentNonce, lastRewardBlockNonce, farmTokenSupply, perBlockRewardAmount, produceRewardsEnabled, maxApr, divisionSafetyConstant, rewardPerShare,] = await Promise.all([
            this.stakingGetterService.getShardCurrentBlockNonce(address_utils_1.AddressUtils.computeShard(address_utils_1.AddressUtils.bech32Decode(farmAddress))),
            this.stakingGetterService.getLastRewardBlockNonce(farmAddress),
            this.stakingGetterService.getFarmTokenSupply(farmAddress),
            this.stakingGetterService.getRewardsPerBlock(farmAddress),
            this.stakingGetterService.getProduceRewardsEnabled(farmAddress),
            this.stakingGetterService.getAnnualPercentageRewards(farmAddress),
            this.stakingGetterService.getDivisionSafetyConstant(farmAddress),
            this.stakingGetterService.getRewardPerShare(farmAddress),
        ]);
        const attributesRewardsPerShareBig = new bignumber_js_1.default((_a = decodedAttributes.rewardPerShare) !== null && _a !== void 0 ? _a : 0);
        const amountBig = new bignumber_js_1.default(liquidity);
        const currentBlockBig = new bignumber_js_1.default(currentNonce);
        const lastRewardBlockNonceBig = new bignumber_js_1.default(lastRewardBlockNonce);
        const perBlockRewardAmountBig = new bignumber_js_1.default(perBlockRewardAmount);
        const farmTokenSupplyBig = new bignumber_js_1.default(farmTokenSupply);
        const rewardPerShareBig = new bignumber_js_1.default(rewardPerShare);
        const maxAprBig = new bignumber_js_1.default(maxApr);
        const divisionSafetyConstantBig = new bignumber_js_1.default(divisionSafetyConstant);
        const rewardIncrease = this.calculateRewardIncrease(currentBlockBig, lastRewardBlockNonceBig, produceRewardsEnabled, perBlockRewardAmountBig, farmTokenSupplyBig, maxAprBig);
        const rewardPerShareIncrease = this.calculateRewardPerShareIncrease(rewardIncrease, farmTokenSupplyBig, divisionSafetyConstantBig);
        const futureRewardPerShare = rewardPerShareBig.plus(rewardPerShareIncrease);
        return this.calculateReward(amountBig, futureRewardPerShare, attributesRewardsPerShareBig, divisionSafetyConstantBig);
    }
    calculateReward(amount, currentRewardPerShare, initialRewardPerShare, divisionSafetyConstant) {
        if (currentRewardPerShare.isGreaterThan(initialRewardPerShare)) {
            const rewardPerShareDiff = currentRewardPerShare.minus(initialRewardPerShare);
            return amount
                .multipliedBy(rewardPerShareDiff)
                .dividedBy(divisionSafetyConstant)
                .integerValue();
        }
        else {
            return new bignumber_js_1.default(0);
        }
    }
    calculateRewardPerShareIncrease(rewardIncrease, farmTokenSupply, divisionSafetyConstant) {
        const result = rewardIncrease.multipliedBy(divisionSafetyConstant).dividedBy(farmTokenSupply);
        return result;
    }
    getAmountAprBounded(amount, maxApr) {
        const maxPercent = new bignumber_js_1.default(this.apiConfigService.getStakingMaxPercent());
        const blocksPerYear = new bignumber_js_1.default(this.apiConfigService.getBlocksPerYear());
        const result = new bignumber_js_1.default(amount)
            .multipliedBy(maxApr)
            .dividedBy(maxPercent)
            .dividedBy(blocksPerYear);
        return result;
    }
    calculatePerBlockRewards(currentBlockNonce, lastRewardBlockNonce, produceRewardsEnabled, perBlockRewardAmount) {
        if (currentBlockNonce.isLessThanOrEqualTo(lastRewardBlockNonce) || !produceRewardsEnabled) {
            return new bignumber_js_1.default(0);
        }
        const blockNonceDiff = currentBlockNonce.minus(lastRewardBlockNonce);
        const result = perBlockRewardAmount.multipliedBy(blockNonceDiff);
        return result;
    }
    calculateRewardIncrease(currentBlockNonce, lastRewardBlockNonce, produceRewardsEnabled, perBlockRewardAmount, farmTokenSupply, maxApr) {
        const extraRewardsUnbounded = this.calculatePerBlockRewards(currentBlockNonce, lastRewardBlockNonce, produceRewardsEnabled, perBlockRewardAmount);
        const extraRewardsAprBoundedPerBlock = this.getAmountAprBounded(farmTokenSupply, maxApr).multipliedBy(currentBlockNonce.minus(lastRewardBlockNonce));
        const rewardIncrease = bignumber_js_1.default.minimum(extraRewardsUnbounded, extraRewardsAprBoundedPerBlock);
        return rewardIncrease;
    }
};
StakingComputeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(1, (0, common_1.Inject)(constants_1.STAKEGOLD_API_CONFIG_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [staking_getter_service_1.StakingGetterService, Object])
], StakingComputeService);
exports.StakingComputeService = StakingComputeService;
//# sourceMappingURL=staking.compute.service.js.map