import { Constants } from 'serdnest';

export class CacheInfo {
  key: string = '';
  ttl: number = Constants.oneSecond() * 6;

  static Transactions(hash: string): CacheInfo {
    return {
      key: `transactions:${hash}`,
      ttl: Constants.oneMinute() * 10,
    };
  }

  static FarmContractState(address: string): CacheInfo {
    return {
      key: `farmContractState:${address}`,
      ttl: Constants.oneMinute(),
    };
  }

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
    key: 'currentEpoch',
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

  static RewardsLeft(farmAddress: string): CacheInfo {
    return {
      key: `rewardsLeft:${farmAddress}`,
      ttl: Constants.oneMinute(),
    };
  }

  static getGroupIdentifiers(): CacheInfo {
    return {
      key: `groupIdentifiers`,
      ttl: Constants.oneMinute(),
    };
  }

  static getAddressesByGroupId(groupId: string): CacheInfo {
    return {
      key: `groupAddresses:${groupId}`,
      ttl: Constants.oneMinute(),
    };
  }

  static getFarmTokenId(childContractAddress: string): CacheInfo {
    return {
      key: `farmTokenId:${childContractAddress}`,
      ttl: Constants.oneWeek(),
    };
  }

  static getFarmingTokenId(childContractAddress: string): CacheInfo {
    return {
      key: `farmingTokenId:${childContractAddress}`,
      ttl: Constants.oneWeek(),
    };
  }

  static getRewardTokenId(childContractAddress: string): CacheInfo {
    return {
      key: `rewardTokenId:${childContractAddress}`,
      ttl: Constants.oneWeek(),
    };
  }

  static areRewardsLocked(childContractAddress: string): CacheInfo {
    return {
      key: `areRewardsLocked:${childContractAddress}`,
      ttl: Constants.oneWeek(),
    };
  }

  static stakeToken(identifier: string): CacheInfo {
    return {
      key: `stakeToken:${identifier}`,
      ttl: Constants.oneWeek(),
    };
  }

  static vestingAddressByGroupId(groupId: string): CacheInfo {
    return {
      key: `vestingAddressByGroupId:${groupId}`,
      ttl: Constants.oneWeek(),
    };
  }

  static FarmVestingAddress(farmAddress: string): CacheInfo {
    return {
      key: `farmVestingAddress:${farmAddress}`,
      ttl: Constants.oneWeek(),
    };
  }

  static groupByOwner(address: string): CacheInfo {
    return {
      key: `groupByOwner:${address}`,
      ttl: Constants.oneWeek(),
    };
  }

  static lockedTokenId(groupId: string): CacheInfo {
    return {
      key: `lockedTokenId:${groupId}`,
      ttl: Constants.oneMinute() * 10,
    };
  }

  static FarmState(address: string): CacheInfo {
    return {
      key: `farm-state:${address}`,
      ttl: Constants.oneMinute() * 6,
    };
  }
}
