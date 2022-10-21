"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingService = void 0;
const tslib_1 = require("tslib");
const out_1 = require("@elrondnetwork/erdjs/out");
const common_1 = require("@nestjs/common");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const stakingTokenAttributes_model_1 = require("../../../models/staking/stakingTokenAttributes.model");
const meta_esdt_service_1 = require("../../meta-esdt/meta.esdt.service");
const staking_compute_service_1 = require("./staking.compute.service");
const staking_getter_service_1 = require("./staking.getter.service");
const transactions_farm_service_1 = require("./transactions-farm.service");
const meta_esdt_1 = require("../../../models/meta-esdt");
const utils_1 = require("../../utils");
let StakingService = class StakingService {
    constructor(stakingGetterService, stakingComputeService, metaEsdtService, transactionService) {
        this.stakingGetterService = stakingGetterService;
        this.stakingComputeService = stakingComputeService;
        this.metaEsdtService = metaEsdtService;
        this.transactionService = transactionService;
    }
    async getFarms(address, vmQuery) {
        var _a;
        console.log('getFarms');
        const groups = [];
        const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();
        const farmTokenIds = farmStakingGroups
            .map((group) => group.childContracts.map((childContract) => childContract.farmTokenId))
            .flat();
        const uniqueFarmTokenIds = [...new Set(farmTokenIds.map((id) => id))];
        const metaEsdtsDetails = (_a = (await this.getMetaEsdtsDetails(uniqueFarmTokenIds, address))) !== null && _a !== void 0 ? _a : [];
        await Promise.all(farmStakingGroups.map(async (group) => {
            var _a, _b, _c, _d, _e, _f;
            const farms = (_a = (await this.handleAddressesByGroupId(group, metaEsdtsDetails, vmQuery))) !== null && _a !== void 0 ? _a : [];
            const farmingTokens = await this.getGroupFarmingTokens(group.groupId, farms);
            const farmingToken = (_c = (_b = farms.find((farm) => !(0, meta_esdt_1.isNftCollection)(farm.farmingToken))) === null || _b === void 0 ? void 0 : _b.farmingToken) !== null && _c !== void 0 ? _c : (_d = farms.firstOrUndefined()) === null || _d === void 0 ? void 0 : _d.farmingToken;
            const decimals = (_e = farmingToken === null || farmingToken === void 0 ? void 0 : farmingToken.decimals) !== null && _e !== void 0 ? _e : 0;
            const icon = (_f = farmingToken === null || farmingToken === void 0 ? void 0 : farmingToken.assets) === null || _f === void 0 ? void 0 : _f.svgUrl;
            groups.push({
                groupId: group.groupId,
                farms,
                groupName: this.getGroupName(farms),
                groupDecimals: decimals,
                groupIcon: icon,
                farmingTokens,
            });
        }));
        return groups;
    }
    async getGroupFarmingTokens(groupId, farms) {
        const farmingTokens = [];
        const lockedFarmingToken = await this.getGroupUnlockedFarmingToken(groupId, farms);
        const unlockedFarmingToken = this.getGroupLockedFarmingToken(farms);
        if (lockedFarmingToken) {
            farmingTokens.push(lockedFarmingToken);
        }
        if (unlockedFarmingToken) {
            farmingTokens.push(unlockedFarmingToken);
        }
        return farmingTokens;
    }
    async getGroupUnlockedFarmingToken(groupId, farms) {
        var _a;
        const unlockedFarmingToken = (_a = farms.find((farm) => !(0, meta_esdt_1.isNftCollection)(farm.farmingToken))) === null || _a === void 0 ? void 0 : _a.farmingToken;
        if (unlockedFarmingToken) {
            return unlockedFarmingToken;
        }
        const rewardTokenId = await this.stakingGetterService.getRewardTokenIdByGroupIdentifier(groupId);
        return this.stakingGetterService.getEsdtOrNft(rewardTokenId);
    }
    getGroupLockedFarmingToken(farms) {
        var _a;
        const lockedFarmingToken = (_a = farms.find((farm) => (0, meta_esdt_1.isNftCollection)(farm.farmingToken))) === null || _a === void 0 ? void 0 : _a.farmingToken;
        return lockedFarmingToken;
    }
    async handleAddressesByGroupId(farmStakingGroup, metaEsdtsDetails, vmQuery) {
        var _a, _b;
        const knownFarms = new Map();
        const addressesByGroupId = farmStakingGroup.childContracts;
        for (const childContract of addressesByGroupId) {
            const { farmingTokenId, areRewardsLocked, rewardToken, farmingToken, positions } = await this.getFarmInfo(childContract, metaEsdtsDetails, vmQuery);
            let farm;
            const foundFarm = knownFarms.get(farmingTokenId);
            if (foundFarm) {
                farm = foundFarm;
            }
            else {
                farm = {
                    farmingToken,
                    positions: Array(),
                };
            }
            farm.farmStaking = {
                addressWithLockedRewards: areRewardsLocked
                    ? childContract.farmAddress.toString()
                    : (_a = farm.farmStaking) === null || _a === void 0 ? void 0 : _a.addressWithLockedRewards,
                addressWithUnlockedRewards: !areRewardsLocked
                    ? childContract.farmAddress.toString()
                    : (_b = farm.farmStaking) === null || _b === void 0 ? void 0 : _b.addressWithUnlockedRewards,
            };
            farm.lockedRewardToken = areRewardsLocked ? rewardToken : farm.lockedRewardToken;
            farm.unlockedRewardToken = !areRewardsLocked ? rewardToken : farm.unlockedRewardToken;
            const { apr, lockedApr } = await this.getAnnualPercentageRewards(farm.farmStaking);
            farm.apr = apr;
            farm.lockedApr = lockedApr;
            farm.positions.push(...positions);
            knownFarms.set(farmingTokenId, farm);
        }
        return Array.from(knownFarms.values());
    }
    async getFarmInfo(childFarmStakingContract, metaEsdtsDetails, vmQuery) {
        const farmAddress = childFarmStakingContract.farmAddress;
        const farmingTokenId = childFarmStakingContract.farmingTokenId;
        const areRewardsLocked = childFarmStakingContract.areRewardsLocked;
        const [farmingToken, rewardToken] = await Promise.all([
            await this.stakingGetterService.getEsdtOrNft(childFarmStakingContract.farmingTokenId),
            await this.stakingGetterService.getEsdtOrNft(childFarmStakingContract.rewardTokenId),
        ]);
        let positions = [];
        if (rewardToken) {
            positions = await this.stakingComputeService.computePositions(farmAddress, childFarmStakingContract.farmTokenId, rewardToken, metaEsdtsDetails, vmQuery !== null && vmQuery !== void 0 ? vmQuery : false);
        }
        return {
            farmingTokenId,
            areRewardsLocked,
            rewardToken,
            farmingToken,
            positions,
        };
    }
    async getMetaEsdtsDetails(farmTokens, address) {
        if (!address) {
            return [];
        }
        const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, farmTokens);
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
    async getAnnualPercentageRewards(farmStaking) {
        let lockedApr = undefined;
        if (farmStaking.addressWithLockedRewards) {
            lockedApr = await this.stakingComputeService.computeAnnualPercentageReward(farmStaking.addressWithLockedRewards);
        }
        let apr = undefined;
        if (farmStaking.addressWithUnlockedRewards) {
            apr = await this.stakingComputeService.computeAnnualPercentageReward(farmStaking.addressWithUnlockedRewards);
        }
        return { apr, lockedApr };
    }
    getGroupName(farms) {
        var _a;
        let groupName = '';
        for (let i = 0; i < farms.length; i++) {
            const ticker = (_a = farms[i].farmingToken) === null || _a === void 0 ? void 0 : _a.ticker.split('-');
            if (ticker.length > 0) {
                const name = ticker[0];
                groupName += name;
                if (i !== farms.length - 1) {
                    groupName += ' / ';
                }
            }
        }
        return groupName;
    }
    async getGroupTotalSupply(group) {
        let totalLockedValue = new bignumber_js_1.default(0);
        for (const farm of group.farms) {
            const farmStaking = farm.farmStaking;
            if (farmStaking.addressWithLockedRewards) {
                const lockedRewardsTotalSupply = await this.getFarmTotalSupply(farmStaking.addressWithLockedRewards);
                totalLockedValue = totalLockedValue.plus(new bignumber_js_1.default(lockedRewardsTotalSupply));
            }
            if (farmStaking.addressWithUnlockedRewards) {
                const unlockedRewardsTotalSupply = await this.getFarmTotalSupply(farmStaking.addressWithUnlockedRewards);
                totalLockedValue = totalLockedValue.plus(new bignumber_js_1.default(unlockedRewardsTotalSupply));
            }
        }
        return totalLockedValue.toFixed();
    }
    async getFarmTotalSupply(farmAddress) {
        if (!farmAddress) {
            return '0';
        }
        return await this.stakingGetterService.getFarmTokenSupply(farmAddress);
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
                const unlockDate = await this.getUnlockDate(remainingEpochs);
                const unboundFarmTokenAttributes = new stakingTokenAttributes_model_1.UnbondTokenAttributesModel({
                    identifier: arg.identifier,
                    attributes: arg.attributes,
                    remainingEpochs,
                    unlockDate,
                });
                decodedAttributesBatch.push(unboundFarmTokenAttributes);
            }
        }
        catch (e) {
            console.error(e);
        }
        return decodedAttributesBatch;
    }
    async getUnlockDate(remainingEpochs) {
        var _a;
        if (!remainingEpochs) {
            return undefined;
        }
        const stats = await this.stakingGetterService.getStats();
        const { unlocksAtDate, unlocksAtText } = (0, utils_1.calcUnlockDateText)({
            epochs: remainingEpochs,
            stats,
            hasSteps: false,
        });
        return (_a = `${unlocksAtText} ${unlocksAtDate}`) === null || _a === void 0 ? void 0 : _a.trim();
    }
    async getUnbondigRemaingEpochs(unlockEpoch) {
        var _a;
        const currentEpoch = (_a = (await this.stakingGetterService.getStats())) === null || _a === void 0 ? void 0 : _a.epoch;
        return unlockEpoch - currentEpoch > 0 ? unlockEpoch - currentEpoch : 0;
    }
    async stake(sender, groupId, args) {
        return await this.transactionService.stake(sender, groupId, args);
    }
    async lockAndStake(sender, groupId, stakingArgs) {
        const groupIdentifiers = await this.stakingGetterService.getGroupIdentifiers();
        if (!groupIdentifiers.includes(groupId)) {
            throw new common_1.BadRequestException('The given group does not exist');
        }
        return await this.transactionService.lockAndStake(sender, groupId, stakingArgs);
    }
    async mergeTokens(sender, tokens) {
        return await this.transactionService.mergeTokens(sender, tokens);
    }
    async unlockToken(sender, token) {
        return await this.transactionService.unlockToken(sender, token);
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
    tslib_1.__metadata("design:paramtypes", [staking_getter_service_1.StakingGetterService,
        staking_compute_service_1.StakingComputeService,
        meta_esdt_service_1.MetaEsdtService,
        transactions_farm_service_1.TransactionsFarmService])
], StakingService);
exports.StakingService = StakingService;
//# sourceMappingURL=staking.service.js.map