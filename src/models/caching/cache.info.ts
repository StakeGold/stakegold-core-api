import { Constants } from '@elrondnetwork/erdnest';

export class CacheInfo {
  key: string = '';
  ttl: number = Constants.oneSecond() * 6;

  static Transactions(hash: string): CacheInfo {
    return {
      key: `transactions:${hash}`,
      ttl: Constants.oneMinute() * 10,
    };
  }

  static FarmTokenSupply(address: string): CacheInfo {
    return {
      key: `farmTokenSupply:${address}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static AnnualPercentageRewards(address: string): CacheInfo {
    return {
      key: `annualPercentageRewards:${address}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static PerBlockRewardAmount(address: string): CacheInfo {
    return {
      key: `perBlockRewardAmount:${address}`,
      ttl: Constants.oneSecond() * 6,
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
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getRewardsPerBlock(farmAddress: string): CacheInfo {
    return {
      key: `rewardsPerBlock:${farmAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getUndistributedFees(farmAddress: string): CacheInfo {
    return {
      key: `undistributedFees:${farmAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getCurrentBlockFee(farmAddress: string): CacheInfo {
    return {
      key: `currentBlockFee:${farmAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getDivisionSafetyConstant(farmAddress: string): CacheInfo {
    return {
      key: `divisionSafetyConstant:${farmAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getProduceRewardsEnabled(farmAddress: string): CacheInfo {
    return {
      key: `produceRewardsEnabled:${farmAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getRewardPerShare(farmAddress: string): CacheInfo {
    return {
      key: `rewardPerShare:${farmAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getGroupIdentifiers(): CacheInfo {
    return {
      key: `groupIdentifiers`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getAddressesByGroupId(groupId: string): CacheInfo {
    return {
      key: `groupAddresses:${groupId}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getFarmTokenId(childContractAddress: string): CacheInfo {
    return {
      key: `farmTokenId:${childContractAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getFarmingTokenId(childContractAddress: string): CacheInfo {
    return {
      key: `farmingTokenId:${childContractAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static getRewardTokenId(childContractAddress: string): CacheInfo {
    return {
      key: `rewardTokenId:${childContractAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static areRewardsLocked(childContractAddress: string): CacheInfo {
    return {
      key: `areRewardsLocked:${childContractAddress}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static stakeToken(identifier: string): CacheInfo {
    return {
      key: `stakeToken:${identifier}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static vestingAddressByGroupId(groupId: string): CacheInfo {
    return {
      key: `vestingAddressByGroupId:${groupId}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static groupByOwner(address: string): CacheInfo {
    return {
      key: `groupByOwner:${address}`,
      ttl: Constants.oneSecond() * 6,
    };
  }

  static lockedTokenId(groupId: string): CacheInfo {
    return {
      key: `lockedTokenId:${groupId}`,
      ttl: Constants.oneSecond() * 6,
    };
  }
}
