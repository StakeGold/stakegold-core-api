"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingService = void 0;
const tslib_1 = require("tslib");
const out_1 = require("@elrondnetwork/erdjs/out");
const common_1 = require("@nestjs/common");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const stakingTokenAttributes_model_1 = require("../../../models/staking/stakingTokenAttributes.model");
const meta_esdt_service_1 = require("../../meta-esdt/meta.esdt.service");
const constants_1 = require("../../utils/constants");
const staking_compute_service_1 = require("./staking.compute.service");
const staking_getter_service_1 = require("./staking.getter.service");
const transactions_farm_service_1 = require("./transactions-farm.service");
let StakingService = class StakingService {
    constructor(stakingGetterService, stakingComputeService, metaEsdtService, apiConfigService, transactionService) {
        this.stakingGetterService = stakingGetterService;
        this.stakingComputeService = stakingComputeService;
        this.metaEsdtService = metaEsdtService;
        this.apiConfigService = apiConfigService;
        this.transactionService = transactionService;
    }
    async getFarms(address, vmQuery) {
        var _a;
        const farms = [];
        const groupIds = await this.stakingGetterService.getGroupIdentifiers();
        const metaEsdtsDetails = (_a = (await this.getMetaEsdtsDetails(address))) !== null && _a !== void 0 ? _a : [];
        const results = await Promise.all(groupIds.map((groupId) => {
            const knownFarms = new Map();
            return this.handleAddressesByGroupId(groupId, metaEsdtsDetails, knownFarms, vmQuery);
        }));
        farms.push(...results.flat());
        return farms;
    }
    async handleAddressesByGroupId(groupId, metaEsdtsDetails, knownFarms, vmQuery) {
        const addressesByGroupId = await this.stakingGetterService.getAddressesByGroupId(groupId);
        const results = await Promise.all(addressesByGroupId.map(async (farmAddress) => {
            var _a, _b, _c;
            const { farmingTokenId, areRewardsLocked, farmingToken, positions } = await this.getFarmInfo(farmAddress.toString(), groupId, metaEsdtsDetails, vmQuery);
            const farm = (_a = knownFarms.get(farmingTokenId)) !== null && _a !== void 0 ? _a : {
                farmingToken,
                positions: Array(),
                groupId: groupId,
            };
            farm.farmAddresses = {
                addressWithLockedRewards: areRewardsLocked
                    ? farmAddress.toString()
                    : (_b = farm.farmAddresses) === null || _b === void 0 ? void 0 : _b.addressWithLockedRewards,
                addressWithUnlockedRewards: !areRewardsLocked
                    ? farmAddress.toString()
                    : (_c = farm.farmAddresses) === null || _c === void 0 ? void 0 : _c.addressWithUnlockedRewards,
            };
            farm.positions.push(...positions);
            knownFarms.set(farmingTokenId, farm);
            return farm;
        }));
        return results;
    }
    async getFarmInfo(farmAddress, groupId, metaEsdtsDetails, vmQuery) {
        const [farmTokenId, farmingTokenId, areRewardsLocked] = await Promise.all([
            await this.stakingGetterService.getFarmTokenId(farmAddress),
            await this.stakingGetterService.getFarmingTokenId(farmAddress),
            await this.stakingGetterService.areRewardsLocked(farmAddress),
        ]);
        let rewardTokenId;
        if (areRewardsLocked) {
            rewardTokenId = await this.stakingGetterService.getLockedAssetTokenId(groupId);
        }
        else {
            rewardTokenId = await this.stakingGetterService.getRewardTokenId(farmAddress);
        }
        const [farmingToken, rewardToken] = await Promise.all([
            await this.stakingGetterService.getToken(farmingTokenId),
            await this.stakingGetterService.getToken(rewardTokenId),
        ]);
        let positions = [];
        if (rewardToken) {
            positions = await this.stakingComputeService.computePositions(farmAddress, farmTokenId, rewardToken, metaEsdtsDetails, vmQuery !== null && vmQuery !== void 0 ? vmQuery : false);
        }
        return {
            farmingTokenId,
            areRewardsLocked,
            farmingToken,
            positions,
        };
    }
    async getMetaEsdtsDetails(address) {
        if (!address) {
            return [];
        }
        const farmTokensAddressMap = this.apiConfigService.getFarmTokens();
        const farmTokensAddress = Array.from(Object.keys(farmTokensAddressMap));
        const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, farmTokensAddress);
        const promises = metaEsdts.map(async (metaEsdt) => {
            const stakeDecodedAttributes = this.decodeStakingTokenAttributes({
                batchAttributes: [
                    {
                        attributes: metaEsdt.attributes,
                        identifier: metaEsdt.identifier,
                    },
                ],
            });
            if (stakeDecodedAttributes && stakeDecodedAttributes.length > 0) {
                const stakeFarmToken = metaEsdt;
                stakeFarmToken.decodedAttributes = stakeDecodedAttributes[0];
                return stakeFarmToken;
            }
            else {
                const unbondDecodedAttributes = await this.decodeUnboundTokenAttributes({
                    batchAttributes: [
                        {
                            attributes: metaEsdt.attributes,
                            identifier: metaEsdt.identifier,
                        },
                    ],
                });
                const unbondFarmToken = metaEsdt;
                if (unbondDecodedAttributes && unbondDecodedAttributes.length > 0) {
                    unbondFarmToken.decodedAttributes = unbondDecodedAttributes[0];
                }
                return unbondFarmToken;
            }
        });
        return await Promise.all(promises);
    }
    async getApr(address) {
        const apr = await this.stakingComputeService.computeAnnualPercentageReward(address);
        return apr;
    }
    async getAnnualPercentageRewards(farmAddress) {
        let lockedApr = undefined;
        if (farmAddress.addressWithUnlockedRewards) {
            lockedApr = await this.stakingComputeService.computeAnnualPercentageReward(farmAddress.addressWithUnlockedRewards);
        }
        let apr = undefined;
        if (farmAddress.addressWithUnlockedRewards) {
            apr = await this.stakingComputeService.computeAnnualPercentageReward(farmAddress.addressWithUnlockedRewards);
        }
        return { apr, lockedApr };
    }
    async getFarmTokenSupply(farmAddress) {
        let totalLockedValue = new bignumber_js_1.default(0);
        if (farmAddress.addressWithLockedRewards) {
            const farmTotalSupply = await this.stakingGetterService.getFarmTokenSupply(farmAddress.addressWithLockedRewards);
            totalLockedValue = totalLockedValue.plus(new bignumber_js_1.default(farmTotalSupply));
        }
        if (farmAddress.addressWithUnlockedRewards) {
            const farmTotalSupply = await this.stakingGetterService.getFarmTokenSupply(farmAddress.addressWithUnlockedRewards);
            totalLockedValue = totalLockedValue.plus(new bignumber_js_1.default(farmTotalSupply));
        }
        return totalLockedValue.toFixed();
    }
    decodeStakingTokenAttributes(args) {
        try {
            return args.batchAttributes.map((arg) => {
                var _a;
                const attributesBuffer = Buffer.from((_a = arg.attributes) !== null && _a !== void 0 ? _a : '', 'base64');
                const codec = new out_1.BinaryCodec();
                const structType = stakingTokenAttributes_model_1.StakingTokenAttributesModel.getStructure();
                const [decoded] = codec.decodeNested(attributesBuffer, structType);
                const decodedAttributes = decoded.valueOf();
                const stakingTokenAttributes = stakingTokenAttributes_model_1.StakingTokenAttributesModel.fromDecodedAttributes(decodedAttributes);
                stakingTokenAttributes.identifier = arg.identifier;
                stakingTokenAttributes.attributes = arg.attributes;
                return stakingTokenAttributes;
            });
        }
        catch (e) {
            return [];
        }
    }
    async decodeUnboundTokenAttributes(args) {
        var _a;
        const decodedAttributesBatch = [];
        try {
            for (const arg of args.batchAttributes) {
                const attributesBuffer = Buffer.from((_a = arg.attributes) !== null && _a !== void 0 ? _a : '', 'base64');
                const codec = new out_1.BinaryCodec();
                const structType = stakingTokenAttributes_model_1.UnbondTokenAttributesModel.getStructure();
                const [decoded] = codec.decodeNested(attributesBuffer, structType);
                const decodedAttributes = decoded.valueOf();
                const remainingEpochs = await this.getUnbondigRemaingEpochs(decodedAttributes.unlockEpoch.toNumber());
                const unboundFarmTokenAttributes = new stakingTokenAttributes_model_1.UnbondTokenAttributesModel({
                    identifier: arg.identifier,
                    attributes: arg.attributes,
                    remainingEpochs,
                });
                decodedAttributesBatch.push(unboundFarmTokenAttributes);
            }
        }
        catch (e) {
            console.error(e);
        }
        return decodedAttributesBatch;
    }
    async getUnbondigRemaingEpochs(unlockEpoch) {
        const currentEpoch = await this.stakingGetterService.getCurrentEpoch();
        return unlockEpoch - currentEpoch > 0 ? unlockEpoch - currentEpoch : 0;
    }
    async stake(sender, args) {
        return await this.transactionService.stake(sender, args);
    }
    async unstake(sender, args) {
        return await this.transactionService.unstake(sender, args);
    }
    async unbond(sender, args) {
        return await this.transactionService.unbond(sender, args);
    }
    async reinvest(sender, args) {
        return await this.transactionService.reinvest(sender, args);
    }
    async harvest(sender, args) {
        return await this.transactionService.harvest(sender, args);
    }
};
StakingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(3, (0, common_1.Inject)(constants_1.STAKEGOLD_API_CONFIG_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [staking_getter_service_1.StakingGetterService,
        staking_compute_service_1.StakingComputeService,
        meta_esdt_service_1.MetaEsdtService, Object, transactions_farm_service_1.TransactionsFarmService])
], StakingService);
exports.StakingService = StakingService;
//# sourceMappingURL=staking.service.js.map