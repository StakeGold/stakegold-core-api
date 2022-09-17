import { FarmGroup, Position } from '../../../models/staking/Farm';
import { StakeFarmToken } from '../../../models/staking/stakeFarmToken.model';
import { StakingTokenAttributesModel } from '../../../models/staking/stakingTokenAttributes.model';
import { StakeGoldApiConfigService } from '../../api-config/api-config.service';
import { StakingGetterService } from './staking.getter.service';
import BigNumber from 'bignumber.js';
import { EsdtToken, NftCollection, UnbondFarmToken } from 'src/models';
export declare class StakingComputeService {
    private readonly stakingGetterService;
    private readonly apiConfigService;
    constructor(stakingGetterService: StakingGetterService, apiConfigService: StakeGoldApiConfigService);
    computeAnnualPercentageReward(address: string): Promise<number | undefined>;
    private getAllAprs;
    computeLowestApr(group: FarmGroup): number | undefined;
    computeHighestApr(group: FarmGroup): number | undefined;
    computeAccumulatedStakings(group: FarmGroup): string;
    computeAccumulatedRewards(group: FarmGroup): string;
    computePositions(farmAddress: string, farmTokenId: string, rewardToken: NftCollection | EsdtToken, metaEsdts: (StakeFarmToken | UnbondFarmToken)[], vmQuery: boolean): Promise<Position[]>;
    getRewardsForPosition(stakeAddress: string, esdt: StakeFarmToken | UnbondFarmToken, vmQuery: boolean): Promise<BigNumber>;
    computeFarmRewardsForPosition(farmAddress: string, liquidity: string, decodedAttributes: StakingTokenAttributesModel): Promise<BigNumber>;
    calculateReward(amount: BigNumber, currentRewardPerShare: BigNumber, initialRewardPerShare: BigNumber, divisionSafetyConstant: BigNumber): BigNumber;
    calculateRewardPerShareIncrease(rewardIncrease: BigNumber, farmTokenSupply: BigNumber, divisionSafetyConstant: BigNumber): BigNumber;
    getAmountAprBounded(amount: BigNumber, maxApr: BigNumber): BigNumber;
    calculatePerBlockRewards(currentBlockNonce: BigNumber, lastRewardBlockNonce: BigNumber, produceRewardsEnabled: boolean, perBlockRewardAmount: BigNumber): BigNumber;
    calculateRewardIncrease(currentBlockNonce: BigNumber, lastRewardBlockNonce: BigNumber, produceRewardsEnabled: boolean, perBlockRewardAmount: BigNumber, farmTokenSupply: BigNumber, maxApr: BigNumber): BigNumber;
}
