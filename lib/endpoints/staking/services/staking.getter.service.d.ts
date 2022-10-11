import BigNumber from 'bignumber.js';
import { AbiStakingService } from './staking.abi.service';
import { CachingService } from 'serdnest';
import { StakeGoldProxyService } from '../../proxy/proxy.service';
import { StakeGoldElrondApiService } from 'src/endpoints/elrond-communication/elrond-api.service';
import { EsdtToken, NftCollection } from 'src/models';
import { FarmState } from '../../../models/staking';
import { FarmStakingGroupContract } from 'src/models/staking/farm.staking.contract';
export declare class StakingGetterService {
    private readonly abiService;
    private readonly cachingService;
    private readonly elrondApiService;
    private readonly proxyService;
    private readonly logger;
    constructor(abiService: AbiStakingService, cachingService: CachingService, elrondApiService: StakeGoldElrondApiService, proxyService: StakeGoldProxyService);
    private getData;
    calculateRewardsForGivenPosition(farmAddress: string, amount: string, attributes: string): Promise<BigNumber>;
    getContractState(farmAddress: string): Promise<string>;
    getFarmTokenSupply(farmAddress: string): Promise<string>;
    getAnnualPercentageRewards(farmAddress: string): Promise<string>;
    getStats(): Promise<any>;
    getPerBlockRewardAmount(farmAddress: string): Promise<string>;
    getShardCurrentBlockNonce(shardID: number): Promise<number>;
    getLastRewardBlockNonce(farmAddress: string): Promise<number>;
    getRewardsPerBlock(farmAddress: string): Promise<string>;
    getUndistributedFees(farmAddress: string): Promise<string>;
    getCurrentBlockFee(farmAddress: string): Promise<string>;
    getDivisionSafetyConstant(farmAddress: string): Promise<string>;
    getProduceRewardsEnabled(farmAddress: string): Promise<boolean>;
    getRewardPerShare(farmAddress: string): Promise<string>;
    getRewardsLeft(farmAddress: string): Promise<string>;
    getGroupIdentifiers(): Promise<string[]>;
    getAddressesByGroupId(groupId: string): Promise<string[]>;
    getFarmTokenId(childContractAddress: string): Promise<string>;
    getFarmingTokenId(childContractAddress: string): Promise<string>;
    getRewardTokenId(childContractAddress: string): Promise<string>;
    areRewardsLocked(childContractAddress: string): Promise<boolean>;
    getVestingAddressByGroupIdentifier(groupId: string): Promise<string | undefined>;
    getVestingAdressOfFarm(farmAddress: string): Promise<string>;
    getGroupsByOwner(address: string): Promise<string[]>;
    getFarmState(address: string): Promise<FarmState>;
    getEsdtOrNft(identifier: string): Promise<EsdtToken | NftCollection | undefined>;
    getLockedAssetTokenId(groupId: string): Promise<string | undefined>;
    getFarmStakingGroups(): Promise<FarmStakingGroupContract[]>;
    getGroupIdFromLockedAssetId(assetTokenId: string): Promise<string | undefined>;
    getRewardTokenIdByGroupIdentifier(groupId: string): Promise<string>;
}
