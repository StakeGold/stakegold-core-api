"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInfo = void 0;
const serdnest_1 = require("serdnest");
class CacheInfo {
    constructor() {
        this.key = '';
        this.ttl = serdnest_1.Constants.oneSecond() * 6;
    }
    static Transactions(hash) {
        return {
            key: `transactions:${hash}`,
            ttl: serdnest_1.Constants.oneMinute() * 10,
        };
    }
    static FarmContractState(address) {
        return {
            key: `farmContractState:${address}`,
            ttl: serdnest_1.Constants.oneMinute(),
        };
    }
    static FarmTokenSupply(address) {
        return {
            key: `farmTokenSupply:${address}`,
            ttl: serdnest_1.Constants.oneMinute(),
        };
    }
    static AnnualPercentageRewards(address) {
        return {
            key: `annualPercentageRewards:${address}`,
            ttl: serdnest_1.Constants.oneHour(),
        };
    }
    static PerBlockRewardAmount(address) {
        return {
            key: `perBlockRewardAmount:${address}`,
            ttl: serdnest_1.Constants.oneHour(),
        };
    }
    static ShardCurrentBlockNonce(shardID) {
        return {
            key: `shardBlockNonce:${shardID}`,
            ttl: serdnest_1.Constants.oneSecond() * 6,
        };
    }
    static getLastRewardBlockNonce(farmAddress) {
        return {
            key: `lastRewardBlockNonce:${farmAddress}`,
            ttl: serdnest_1.Constants.oneMinute(),
        };
    }
    static getRewardsPerBlock(farmAddress) {
        return {
            key: `rewardsPerBlock:${farmAddress}`,
            ttl: serdnest_1.Constants.oneMinute() * 2,
        };
    }
    static getUndistributedFees(farmAddress) {
        return {
            key: `undistributedFees:${farmAddress}`,
            ttl: serdnest_1.Constants.oneMinute(),
        };
    }
    static getCurrentBlockFee(farmAddress) {
        return {
            key: `currentBlockFee:${farmAddress}`,
            ttl: serdnest_1.Constants.oneMinute(),
        };
    }
    static getDivisionSafetyConstant(farmAddress) {
        return {
            key: `divisionSafetyConstant:${farmAddress}`,
            ttl: serdnest_1.Constants.oneHour(),
        };
    }
    static getProduceRewardsEnabled(farmAddress) {
        return {
            key: `produceRewardsEnabled:${farmAddress}`,
            ttl: serdnest_1.Constants.oneMinute() * 2,
        };
    }
    static getRewardPerShare(farmAddress) {
        return {
            key: `rewardPerShare:${farmAddress}`,
            ttl: serdnest_1.Constants.oneMinute(),
        };
    }
    static RewardsLeft(farmAddress) {
        return {
            key: `rewardsLeft:${farmAddress}`,
            ttl: serdnest_1.Constants.oneMinute(),
        };
    }
    static getGroupIdentifiers() {
        return {
            key: `groupIdentifiers`,
            ttl: serdnest_1.Constants.oneMinute(),
        };
    }
    static getAddressesByGroupId(groupId) {
        return {
            key: `groupAddresses:${groupId}`,
            ttl: serdnest_1.Constants.oneMinute(),
        };
    }
    static getFarmTokenId(childContractAddress) {
        return {
            key: `farmTokenId:${childContractAddress}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
    static getFarmingTokenId(childContractAddress) {
        return {
            key: `farmingTokenId:${childContractAddress}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
    static getRewardTokenId(childContractAddress) {
        return {
            key: `rewardTokenId:${childContractAddress}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
    static areRewardsLocked(childContractAddress) {
        return {
            key: `areRewardsLocked:${childContractAddress}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
    static stakeToken(identifier) {
        return {
            key: `stakeToken:${identifier}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
    static vestingAddressByGroupId(groupId) {
        return {
            key: `vestingAddressByGroupId:${groupId}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
    static FarmVestingAddress(farmAddress) {
        return {
            key: `farmVestingAddress:${farmAddress}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
    static groupByOwner(address) {
        return {
            key: `groupByOwner:${address}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
    static lockedTokenId(groupId) {
        return {
            key: `lockedTokenId:${groupId}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
    static FarmState(address) {
        return {
            key: `farm-state:${address}`,
            ttl: serdnest_1.Constants.oneSecond() * 6,
        };
    }
    static RewardTokenIdByGroupId(groupId) {
        return {
            key: `rewardTokenIdByGroupId:${groupId}`,
            ttl: serdnest_1.Constants.oneWeek(),
        };
    }
}
exports.CacheInfo = CacheInfo;
CacheInfo.Stats = {
    key: 'stats',
    ttl: serdnest_1.Constants.oneMinute(),
};
//# sourceMappingURL=cache.info.js.map