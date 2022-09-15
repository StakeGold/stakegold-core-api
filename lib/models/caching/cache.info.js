"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInfo = void 0;
const erdnest_1 = require("@elrondnetwork/erdnest");
class CacheInfo {
    constructor() {
        this.key = '';
        this.ttl = erdnest_1.Constants.oneSecond() * 6;
    }
    static Transactions(hash) {
        return {
            key: `transactions:${hash}`,
            ttl: erdnest_1.Constants.oneMinute() * 10,
        };
    }
    static FarmTokenSupply(address) {
        return {
            key: `farmTokenSupply:${address}`,
            ttl: erdnest_1.Constants.oneMinute(),
        };
    }
    static AnnualPercentageRewards(address) {
        return {
            key: `annualPercentageRewards:${address}`,
            ttl: erdnest_1.Constants.oneHour(),
        };
    }
    static PerBlockRewardAmount(address) {
        return {
            key: `perBlockRewardAmount:${address}`,
            ttl: erdnest_1.Constants.oneHour(),
        };
    }
    static ShardCurrentBlockNonce(shardID) {
        return {
            key: `shardBlockNonce:${shardID}`,
            ttl: erdnest_1.Constants.oneSecond() * 6,
        };
    }
    static getLastRewardBlockNonce(farmAddress) {
        return {
            key: `lastRewardBlockNonce:${farmAddress}`,
            ttl: erdnest_1.Constants.oneMinute(),
        };
    }
    static getRewardsPerBlock(farmAddress) {
        return {
            key: `rewardsPerBlock:${farmAddress}`,
            ttl: erdnest_1.Constants.oneMinute() * 2,
        };
    }
    static getUndistributedFees(farmAddress) {
        return {
            key: `undistributedFees:${farmAddress}`,
            ttl: erdnest_1.Constants.oneMinute(),
        };
    }
    static getCurrentBlockFee(farmAddress) {
        return {
            key: `currentBlockFee:${farmAddress}`,
            ttl: erdnest_1.Constants.oneMinute(),
        };
    }
    static getDivisionSafetyConstant(farmAddress) {
        return {
            key: `divisionSafetyConstant:${farmAddress}`,
            ttl: erdnest_1.Constants.oneHour(),
        };
    }
    static getProduceRewardsEnabled(farmAddress) {
        return {
            key: `produceRewardsEnabled:${farmAddress}`,
            ttl: erdnest_1.Constants.oneMinute() * 2,
        };
    }
    static getRewardPerShare(farmAddress) {
        return {
            key: `rewardPerShare:${farmAddress}`,
            ttl: erdnest_1.Constants.oneMinute(),
        };
    }
    static getGroupIdentifiers() {
        return {
            key: `groupIdentifiers`,
            ttl: erdnest_1.Constants.oneMinute(),
        };
    }
    static getAddressesByGroupId(groupId) {
        return {
            key: `groupAddresses:${groupId}`,
            ttl: erdnest_1.Constants.oneMinute(),
        };
    }
    static getFarmTokenId(childContractAddress) {
        return {
            key: `farmTokenId:${childContractAddress}`,
            ttl: erdnest_1.Constants.oneWeek(),
        };
    }
    static getFarmingTokenId(childContractAddress) {
        return {
            key: `farmingTokenId:${childContractAddress}`,
            ttl: erdnest_1.Constants.oneWeek(),
        };
    }
    static getRewardTokenId(childContractAddress) {
        return {
            key: `rewardTokenId:${childContractAddress}`,
            ttl: erdnest_1.Constants.oneWeek(),
        };
    }
    static areRewardsLocked(childContractAddress) {
        return {
            key: `areRewardsLocked:${childContractAddress}`,
            ttl: erdnest_1.Constants.oneWeek(),
        };
    }
    static stakeToken(identifier) {
        return {
            key: `stakeToken:${identifier}`,
            ttl: erdnest_1.Constants.oneWeek(),
        };
    }
    static vestingAddressByGroupId(groupId) {
        return {
            key: `vestingAddressByGroupId:${groupId}`,
            ttl: erdnest_1.Constants.oneWeek(),
        };
    }
}
exports.CacheInfo = CacheInfo;
CacheInfo.CurrentEpoch = {
    key: 'currentEpoch',
    ttl: erdnest_1.Constants.oneSecond() * 6,
};
//# sourceMappingURL=cache.info.js.map