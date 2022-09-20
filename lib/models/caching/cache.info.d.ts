export declare class CacheInfo {
    key: string;
    ttl: number;
    static Transactions(hash: string): CacheInfo;
    static FarmTokenSupply(address: string): CacheInfo;
    static AnnualPercentageRewards(address: string): CacheInfo;
    static PerBlockRewardAmount(address: string): CacheInfo;
    static CurrentEpoch: CacheInfo;
    static ShardCurrentBlockNonce(shardID: string): CacheInfo;
    static getLastRewardBlockNonce(farmAddress: string): CacheInfo;
    static getRewardsPerBlock(farmAddress: string): CacheInfo;
    static getUndistributedFees(farmAddress: string): CacheInfo;
    static getCurrentBlockFee(farmAddress: string): CacheInfo;
    static getDivisionSafetyConstant(farmAddress: string): CacheInfo;
    static getProduceRewardsEnabled(farmAddress: string): CacheInfo;
    static getRewardPerShare(farmAddress: string): CacheInfo;
    static getGroupIdentifiers(): CacheInfo;
    static getAddressesByGroupId(groupId: string): CacheInfo;
    static getFarmTokenId(childContractAddress: string): CacheInfo;
    static getFarmingTokenId(childContractAddress: string): CacheInfo;
    static getRewardTokenId(childContractAddress: string): CacheInfo;
    static areRewardsLocked(childContractAddress: string): CacheInfo;
    static stakeToken(identifier: string): CacheInfo;
    static vestingAddressByGroupId(groupId: string): CacheInfo;
    static groupByOwner(address: string): CacheInfo;
    static lockedTokenId(groupId: string): CacheInfo;
}
