import { Constants } from "@elrondnetwork/erdnest";

export class CacheInfo {
  key: string = "";
  ttl: number = Constants.oneSecond() * 6;

  static WhitelistAddress(address: string): CacheInfo {
    return {
      key: `whitelistAddress:${address}`,
      ttl: Constants.oneHour(),
    };
  }

  static Transactions(hash: string): CacheInfo {
    return {
      key: `transactions:${hash}`,
      ttl: Constants.oneMinute() * 10,
    };
  }

  // static WhitelistActive: CacheInfo = {
  //   key: 'WhitelistActive',
  //   ttl: Constants.oneHour(),
  // };

  // static BuyMinLimit: CacheInfo = {
  //   key: 'BuyMinLimit',
  //   ttl: Constants.oneHour(),
  // };

  // static BuyMaxLimit: CacheInfo = {
  //   key: 'BuyMaxLimit',
  //   ttl: Constants.oneHour(),
  // };

  // static SwappedEgld: CacheInfo = {
  //   key: 'SwappedEgld',
  //   ttl: Constants.oneHour(),
  // };

  // static SaleStartTimestamp: CacheInfo = {
  //   key: 'SaleStartTimestamp',
  //   ttl: Constants.oneHour(),
  // };

  // static Pause: CacheInfo = {
  //   key: 'Pause',
  //   ttl: Constants.oneHour(),
  // };

  // static SoldTokens: CacheInfo = {
  //   key: 'sold-tokens',
  //   ttl: Constants.oneSecond() * 6,
  // };

  static FarmTokenSupply(address: string): CacheInfo {
    return {
      key: `farmTokenSupply:${address}`,
      ttl: Constants.oneMinute(),
    };
  }

  static AnnualPercentageRewards(address: string): CacheInfo {
    return {
      key: `annualPercentageRewards:${address}`,
      ttl: Constants.oneHour(),
    };
  }

  static PerBlockRewardAmount(address: string): CacheInfo {
    return {
      key: `perBlockRewardAmount:${address}`,
      ttl: Constants.oneHour(),
    };
  }

  static CurrentEpoch: CacheInfo = {
    key: "currentEpoch",
    ttl: Constants.oneSecond() * 6,
  };

  static ShardCurrentBlockNonce(shardID: string): CacheInfo {
    return {
      key: `shardBlockNonce:${shardID}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getLastRewardBlockNonce(farmAddress: string): CacheInfo {
    return {
      key: `lastRewardBlockNonce:${farmAddress}`,
      ttl: Constants.oneMinute(),
    };
  }

  static getRewardsPerBlock(farmAddress: string): CacheInfo {
    return {
      key: `rewardsPerBlock:${farmAddress}`,
      ttl: Constants.oneMinute() * 2,
    };
  }

  static getUndistributedFees(farmAddress: string): CacheInfo {
    return {
      key: `undistributedFees:${farmAddress}`,
      ttl: Constants.oneMinute(),
    };
  }

  static getCurrentBlockFee(farmAddress: string): CacheInfo {
    return {
      key: `currentBlockFee:${farmAddress}`,
      ttl: Constants.oneMinute(),
    };
  }

  static getDivisionSafetyConstant(farmAddress: string): CacheInfo {
    return {
      key: `divisionSafetyConstant:${farmAddress}`,
      ttl: Constants.oneHour(),
    };
  }

  static getProduceRewardsEnabled(farmAddress: string): CacheInfo {
    return {
      key: `produceRewardsEnabled:${farmAddress}`,
      ttl: Constants.oneMinute() * 2,
    };
  }

  static getRewardPerShare(farmAddress: string): CacheInfo {
    return {
      key: `rewardPerShare:${farmAddress}`,
      ttl: Constants.oneMinute(),
    };
  }
}
