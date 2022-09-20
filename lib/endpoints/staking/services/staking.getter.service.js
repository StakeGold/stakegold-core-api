"use strict";
var StakingGetterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingGetterService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cache_info_1 = require("../../../models/caching/cache.info");
const constants_1 = require("../../utils/constants");
const staking_abi_service_1 = require("./staking.abi.service");
const erdnest_1 = require("@elrondnetwork/erdnest");
const generate_log_message_1 = require("../../utils/generate-log-message");
let StakingGetterService = StakingGetterService_1 = class StakingGetterService {
    constructor(abiService, cachingService, elrondApiService, proxyService) {
        this.abiService = abiService;
        this.cachingService = cachingService;
        this.elrondApiService = elrondApiService;
        this.proxyService = proxyService;
        this.logger = new common_1.Logger(StakingGetterService_1.name);
    }
    async getData(cacheKey, createValueFunc, ttl = erdnest_1.Constants.oneHour()) {
        try {
            return await this.cachingService.getOrSetCache(cacheKey, createValueFunc, ttl);
        }
        catch (error) {
            const logMessage = (0, generate_log_message_1.generateGetLogMessage)(StakingGetterService_1.name, createValueFunc.name, cacheKey, error);
            this.logger.error(logMessage);
            throw error;
        }
    }
    async calculateRewardsForGivenPosition(farmAddress, amount, attributes) {
        return await this.abiService.calculateRewardsForGivenPosition(farmAddress, amount, attributes);
    }
    async getFarmTokenSupply(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.FarmTokenSupply(farmAddress).key, () => this.abiService.getFarmTokenSupply(farmAddress), cache_info_1.CacheInfo.FarmTokenSupply(farmAddress).ttl);
    }
    async getAnnualPercentageRewards(farmAddress) {
        return await this.getData(cache_info_1.CacheInfo.AnnualPercentageRewards(farmAddress).key, () => this.abiService.getAnnualPercentageRewards(farmAddress), cache_info_1.CacheInfo.AnnualPercentageRewards(farmAddress).ttl);
    }
    async getCurrentEpoch() {
        return await this.getData(cache_info_1.CacheInfo.CurrentEpoch.key, async () => (await this.proxyService.getStats()).epoch, cache_info_1.CacheInfo.CurrentEpoch.ttl);
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
    async getGroupByOwner(address) {
        return await this.getData(cache_info_1.CacheInfo.groupByOwner(address).key, () => this.abiService.getGroupByOwner(address), cache_info_1.CacheInfo.groupByOwner(address).ttl);
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
        return await this.getData(cache_info_1.CacheInfo.lockedTokenId(groupId).key, async () => await this.abiService.getLockedAssetTokenId(vestingAddress), cache_info_1.CacheInfo.lockedTokenId(groupId).ttl);
    }
    async getFarmStakingGroups() {
        const groupIds = await this.getGroupIdentifiers();
        const results = await Promise.all(groupIds.map(async (groupId) => {
            const farmAddresses = await this.getAddressesByGroupId(groupId);
            const childContracts = await Promise.all(farmAddresses.map(async (farmAddress) => {
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
};
StakingGetterService = StakingGetterService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, common_1.Inject)(constants_1.STAKEGOLD_ELROND_API_SERVICE)),
    tslib_1.__param(3, (0, common_1.Inject)(constants_1.STAKEGOLD_PROXY_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [staking_abi_service_1.AbiStakingService,
        erdnest_1.CachingService, Object, Object])
], StakingGetterService);
exports.StakingGetterService = StakingGetterService;
//# sourceMappingURL=staking.getter.service.js.map