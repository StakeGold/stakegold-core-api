export declare class CacheInfo {
    key: string;
    ttl: number;
    static WhitelistAddress(address: string): CacheInfo;
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
}
