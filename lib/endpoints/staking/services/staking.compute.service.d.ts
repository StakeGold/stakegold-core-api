import { MetaEsdtDetailed } from "../../../models/meta-esdt/meta.esdt";
import { Position } from "../../../models/staking/Farm";
import { FarmInfo } from "../../../models/staking/farm.info";
import { StakingTokenAttributesModel } from "../../../models/staking/stakingTokenAttributes.model";
import { StakeGoldApiConfigService } from "../../api-config/api-config.service";
import { StakingGetterService } from "./staking.getter.service";
import BigNumber from "bignumber.js";
export declare class StakingComputeService {
    private readonly stakingGetterService;
    private readonly apiConfigService;
    constructor(stakingGetterService: StakingGetterService, apiConfigService: StakeGoldApiConfigService);
    computeAnnualPercentageReward(address: string): Promise<number | undefined>;
    computePositions(farmInfo: FarmInfo, metaEsdts: MetaEsdtDetailed[], vmQuery: boolean): Promise<Position[]>;
    computeAccumulatedStakings(positions: Position[]): BigNumber;
    computeAccumulatedRewards(positions: Position[]): BigNumber;
    private computePosition;
    getRewardsForPosition(stakeAddress: string, esdt: MetaEsdtDetailed, vmQuery: boolean): Promise<BigNumber>;
    computeFarmRewardsForPosition(farmAddress: string, liquidity: string, decodedAttributes: StakingTokenAttributesModel): Promise<BigNumber>;
    calculateReward(amount: BigNumber, currentRewardPerShare: BigNumber, initialRewardPerShare: BigNumber, divisionSafetyConstant: BigNumber): BigNumber;
    calculateRewardPerShareIncrease(rewardIncrease: BigNumber, farmTokenSupply: BigNumber, divisionSafetyConstant: BigNumber): BigNumber;
    getAmountAprBounded(amount: BigNumber, maxApr: BigNumber): BigNumber;
    calculatePerBlockRewards(currentBlockNonce: BigNumber, lastRewardBlockNonce: BigNumber, produceRewardsEnabled: boolean, perBlockRewardAmount: BigNumber): BigNumber;
    calculateRewardIncrease(currentBlockNonce: BigNumber, lastRewardBlockNonce: BigNumber, produceRewardsEnabled: boolean, perBlockRewardAmount: BigNumber, farmTokenSupply: BigNumber, maxApr: BigNumber): BigNumber;
}
