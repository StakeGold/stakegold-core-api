"use strict";
var StakingGetterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingGetterService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const cache_info_1 = require("../../../models/caching/cache.info");
const constants_1 = require("../../utils/constants");
const staking_abi_service_1 = require("./staking.abi.service");
const serdnest_1 = require("serdnest");
const generate_log_message_1 = require("../../utils/generate-log-message");
const staking_1 = require("../../../models/staking");
let StakingGetterService = StakingGetterService_1 = class StakingGetterService {
    constructor(abiService, cachingService, elrondApiService, proxyService) {
        this.abiService = abiService;
        this.cachingService = cachingService;
        this.elrondApiService = elrondApiService;
        this.proxyService = proxyService;
        this.logger = new common_1.Logger(StakingGetterService_1.name);
    }
    async getData(cacheKey, createValueFunc, ttl = serdnest_1.Constants.oneHour()) {
        var _a, _b;
        try {
            const noCache = (_b = (_a = serdnest_1.ContextTracker.get()) === null || _a === void 0 ? void 0 : _a.noCache) !== null && _b !== void 0 ? _b : false;
            if (noCache) {
                return await createValueFunc();
            }
            const cachedValue = await this.cachingService.getCache(cacheKey);
            if (cachedValue) {
                return cachedValue;
            }
            const funcValue = await createValueFunc();
            if (funcValue) {
                await this.cachingService.setCache(cacheKey, funcValue, ttl);
                return funcValue;
            }
            return undefined;
        }
        catch (error) {
            const logMessage = (0, generate_log_message_1.generateGetLogMessage)(StakingGetterService_1.name, createValueFunc.name, cacheKey, error);
            this.logger.error(logMessage);
            throw error;
        }
    }
    async calculateRewardsForGivenPosition(farmAddress, amount, attributes) {
        try {
            const result = await this.abiService.calculateRewardsForGivenPosition(farmAddress, amount, attributes);
            return new bignumber_js_1.default(result);
        }
        catch (_a) {
            return new bignumber_js_1.default(0);
        }
    }
    async getContractState(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.FarmContractState(farmAddress).key, () => this.abiService.getContractState(farmAddress), cache_info_1.CacheInfo.FarmContractState(farmAddress).ttl);
    }
    async getFarmTokenSupply(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.FarmTokenSupply(farmAddress).key, () => this.abiService.getFarmTokenSupply(farmAddress), cache_info_1.CacheInfo.FarmTokenSupply(farmAddress).ttl);
    }
    async getAnnualPercentageRewards(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.AnnualPercentageRewards(farmAddress).key, () => this.abiService.getAnnualPercentageRewards(farmAddress), cache_info_1.CacheInfo.AnnualPercentageRewards(farmAddress).ttl);
    }
    async getStats() {
        return await this.getData(cache_info_1.CacheInfo.Stats.key, async () => await this.proxyService.getStats(), cache_info_1.CacheInfo.Stats.ttl);
    }
    async getPerBlockRewardAmount(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.PerBlockRewardAmount(farmAddress).key, () => this.abiService.getPerBlockRewardAmount(farmAddress), cache_info_1.CacheInfo.PerBlockRewardAmount(farmAddress).ttl);
    }
    async getShardCurrentBlockNonce(shardID) {
        return await this.getData(cache_info_1.CacheInfo.ShardCurrentBlockNonce(shardID.toString()).key, () => this.elrondApiService.getCurrentBlockNonce(shardID), cache_info_1.CacheInfo.ShardCurrentBlockNonce(shardID.toString()).ttl);
    }
    async getLastRewardBlockNonce(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.getLastRewardBlockNonce(farmAddress).key, () => this.abiService.getLastRewardBlockNonce(farmAddress), cache_info_1.CacheInfo.getLastRewardBlockNonce(farmAddress).ttl);
    }
    async getRewardsPerBlock(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.getRewardsPerBlock(farmAddress).key, () => this.abiService.getRewardsPerBlock(farmAddress), cache_info_1.CacheInfo.getRewardsPerBlock(farmAddress).ttl);
    }
    async getUndistributedFees(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.getUndistributedFees(farmAddress).key, () => this.abiService.getUndistributedFees(farmAddress), cache_info_1.CacheInfo.getUndistributedFees(farmAddress).ttl);
    }
    async getCurrentBlockFee(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.getCurrentBlockFee(farmAddress).key, () => this.abiService.getCurrentBlockFee(farmAddress), cache_info_1.CacheInfo.getCurrentBlockFee(farmAddress).ttl);
    }
    async getDivisionSafetyConstant(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.getDivisionSafetyConstant(farmAddress).key, () => this.abiService.getDivisionSafetyConstant(farmAddress), cache_info_1.CacheInfo.getDivisionSafetyConstant(farmAddress).ttl);
    }
    async getProduceRewardsEnabled(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.getProduceRewardsEnabled(farmAddress).key, () => this.abiService.getProduceRewardsEnabled(farmAddress), cache_info_1.CacheInfo.getProduceRewardsEnabled(farmAddress).ttl);
    }
    async getRewardPerShare(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.getRewardPerShare(farmAddress).key, () => this.abiService.getRewardPerShare(farmAddress), cache_info_1.CacheInfo.getRewardPerShare(farmAddress).ttl);
    }
    async getRewardsLeft(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.RewardsLeft(farmAddress).key, () => this.abiService.getRewardsLeft(farmAddress), cache_info_1.CacheInfo.RewardsLeft(farmAddress).ttl);
    }
    async getGroupIdentifiers() {
        return await this.getData(cache_info_1.CacheInfo.getGroupIdentifiers().key, () => this.abiService.getGroupIdentifiers(), cache_info_1.CacheInfo.getGroupIdentifiers().ttl);
    }
    async getAddressesByGroupId(groupId) {
        return await this.getData(cache_info_1.CacheInfo.getAddressesByGroupId(groupId).key, () => this.abiService.getAddressesByGroupId(groupId), cache_info_1.CacheInfo.getAddressesByGroupId(groupId).ttl);
    }
    async getFarmTokenId(childContractAddress) {
        return await this.getData(cache_info_1.CacheInfo.getFarmTokenId(childContractAddress).key, () => this.abiService.getFarmTokenId(childContractAddress), cache_info_1.CacheInfo.getFarmTokenId(childContractAddress).ttl);
    }
    async getFarmingTokenId(childContractAddress) {
        return await this.getData(cache_info_1.CacheInfo.getFarmingTokenId(childContractAddress).key, () => this.abiService.getFarmingTokenId(childContractAddress), cache_info_1.CacheInfo.getFarmingTokenId(childContractAddress).ttl);
    }
    async getRewardTokenId(childContractAddress) {
        return await this.getData(cache_info_1.CacheInfo.getRewardTokenId(childContractAddress).key, () => this.abiService.getRewardTokenId(childContractAddress), cache_info_1.CacheInfo.getRewardTokenId(childContractAddress).ttl);
    }
    async areRewardsLocked(childContractAddress) {
        return await this.getData(cache_info_1.CacheInfo.areRewardsLocked(childContractAddress).key, () => this.abiService.areRewardsLocked(childContractAddress), cache_info_1.CacheInfo.areRewardsLocked(childContractAddress).ttl);
    }
    async getVestingAddressByGroupIdentifier(groupId) {
        return await this.getData(cache_info_1.CacheInfo.vestingAddressByGroupId(groupId).key, () => this.abiService.getVestingAddressByGroupIdentifier(groupId), cache_info_1.CacheInfo.vestingAddressByGroupId(groupId).ttl);
    }
    async getVestingAdressOfFarm(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.FarmVestingAddress(farmAddress).key, () => this.abiService.getVestingScAddress(farmAddress), cache_info_1.CacheInfo.FarmVestingAddress(farmAddress).ttl);
    }
    async getGroupByOwner(address) {
        return await this.getData(cache_info_1.CacheInfo.groupByOwner(address).key, () => this.abiService.getGroupByOwner(address), cache_info_1.CacheInfo.groupByOwner(address).ttl);
    }
    async getFarmState(address) {
        return await this.getData(cache_info_1.CacheInfo.FarmState(address).key, () => this.abiService.getFarmState(address), cache_info_1.CacheInfo.FarmState(address).ttl);
    }
    async getEsdtOrNft(identifier) {
        try {
            return await this.getData(cache_info_1.CacheInfo.stakeToken(identifier).key, async () => {
                if (!identifier || identifier.length === 0) {
                    return undefined;
                }
                const esdtToken = await this.elrondApiService.getEsdtToken(identifier);
                if (esdtToken) {
                    return esdtToken;
                }
                const nftCollection = await this.elrondApiService.getNftCollection(identifier);
                return nftCollection;
            }, cache_info_1.CacheInfo.stakeToken(identifier).ttl);
        }
        catch (_a) {
            return undefined;
        }
    }
    async getLockedAssetTokenId(groupId) {
        const vestingAddress = await this.getVestingAddressByGroupIdentifier(groupId);
        if (!vestingAddress) {
            return undefined;
        }
        return await this.getData(cache_info_1.CacheInfo.lockedTokenId(groupId).key, async () => await this.abiService.getLockedAssetTokenId(vestingAddress), cache_info_1.CacheInfo.lockedTokenId(groupId).ttl);
    }
    async getFarmStakingGroups() {
        const groupIds = await this.getGroupIdentifiers();
        const results = await Promise.all(groupIds.map(async (groupId) => {
            const farmAddresses = await this.getAddressesByGroupId(groupId);
            const childContracts = await Promise.all(farmAddresses
                .filter(async (farmAddress) => {
                const farmState = await this.getFarmState(farmAddress);
                return farmState === staking_1.FarmState.SETUP_COMPLETE;
            })
                .map(async (farmAddress) => {
                const [farmTokenId, farmingTokenId, areRewardsLocked] = await Promise.all([
                    await this.getFarmTokenId(farmAddress),
                    await this.getFarmingTokenId(farmAddress),
                    await this.areRewardsLocked(farmAddress),
                ]);
                let rewardTokenId;
                if (areRewardsLocked) {
                    rewardTokenId = await this.getLockedAssetTokenId(groupId);
                }
                else {
                    rewardTokenId = await this.getRewardTokenId(farmAddress);
                }
                return {
                    farmAddress,
                    farmTokenId,
                    farmingTokenId,
                    rewardTokenId,
                    areRewardsLocked,
                };
            }));
            return { groupId, childContracts };
        }));
        return results.flat();
    }
    async getGroupIdFromLockedAssetId(assetTokenId) {
        const groupIds = await this.getGroupIdentifiers();
        for (const groupId of groupIds) {
            const lockedAssetTokenId = await this.getLockedAssetTokenId(groupId);
            if (lockedAssetTokenId === assetTokenId) {
                return await this.getVestingAddressByGroupIdentifier(groupId);
            }
        }
        return undefined;
    }
    async getRewardTokenIdByGroupIdentifier(groupId) {
        return await this.getData(cache_info_1.CacheInfo.RewardTokenIdByGroupId(groupId).key, () => this.abiService.getRewardTokenIdByGroupId(groupId), cache_info_1.CacheInfo.RewardTokenIdByGroupId(groupId).ttl);
    }
};
StakingGetterService = StakingGetterService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, common_1.Inject)(constants_1.STAKEGOLD_ELROND_API_SERVICE)),
    tslib_1.__param(3, (0, common_1.Inject)(constants_1.STAKEGOLD_PROXY_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [staking_abi_service_1.AbiStakingService,
        serdnest_1.CachingService, Object, Object])
], StakingGetterService);
exports.StakingGetterService = StakingGetterService;
//# sourceMappingURL=staking.getter.service.js.map