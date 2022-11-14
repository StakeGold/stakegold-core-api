import { Inject, Injectable } from '@nestjs/common';
import { FarmGroup, Position } from '../../../models/staking/Farm';
import { isStakeFarmToken, StakeFarmToken } from '../../../models/staking/stakeFarmToken.model';
import { StakingTokenAttributesModel } from '../../../models/staking/stakingTokenAttributes.model';
import { StakeGoldApiConfigService } from '../../api-config/api-config.service';
import { AddressUtils } from '../../utils/address.utils';
import { STAKEGOLD_API_CONFIG_SERVICE } from '../../utils/constants';
import { NumberUtils } from '../../utils/number.utils';
import { StakingGetterService } from './staking.getter.service';
import BigNumber from 'bignumber.js';
import { EsdtToken, NftCollection, UnbondFarmToken } from 'src/models';

@Injectable()
export class StakingComputeService {
  constructor(
    private readonly stakingGetterService: StakingGetterService,
    @Inject(STAKEGOLD_API_CONFIG_SERVICE)
    private readonly apiConfigService: StakeGoldApiConfigService,
  ) {}

  async computeAnnualPercentageReward(address: string): Promise<number | undefined> {
    const perBlockRewardAmount = await this.stakingGetterService.getPerBlockRewardAmount(address);
    const farmTotalSupply = await this.stakingGetterService.getFarmTokenSupply(address);
    const maxAnnualPercentageRewards = await this.stakingGetterService.getAnnualPercentageRewards(
      address,
    );

    return this.computeCurrentApr(
      perBlockRewardAmount,
      farmTotalSupply,
      maxAnnualPercentageRewards,
    );
  }

  async computeCurrentApr(
    perBlockRewardAmount: string | undefined,
    farmTotalSupply: string | undefined,
    maxAnnualPercentageRewards: string | undefined,
  ): Promise<number | undefined> {
    if (perBlockRewardAmount && farmTotalSupply && maxAnnualPercentageRewards) {
      let totalSupplyNumber = new BigNumber(farmTotalSupply);
      if (totalSupplyNumber.isLessThanOrEqualTo(new BigNumber(0))) {
        totalSupplyNumber = new BigNumber(1);
      }
      // 5256000 => multiply by 10 * 60 * 24 * 365
      const result = new BigNumber(perBlockRewardAmount)
        .multipliedBy(5256000)
        .dividedBy(totalSupplyNumber)
        .multipliedBy(100);
      return Math.min(
        result.toNumber(),
        NumberUtils.denominate(BigInt(maxAnnualPercentageRewards), 2),
      );
    }

    return undefined;
  }

  private getAllAprs(group: FarmGroup): number[] {
    const apr = group.farms.map((farm) => farm.apr).filter((apr) => apr) as number[];
    const lockedApr = group.farms.map((farm) => farm.lockedApr).filter((apr) => apr) as number[];
    return [...apr.map((a) => Math.floor(a)), ...lockedApr.map((a) => Math.floor(a))];
  }

  computeLowestApr(group: FarmGroup): number | undefined {
    const allAprs = this.getAllAprs(group);
    if (allAprs.length === 0) {
      return undefined;
    }
    return Math.min(...this.getAllAprs(group));
  }

  computeHighestApr(group: FarmGroup): number | undefined {
    const allAprs = this.getAllAprs(group);
    if (allAprs.length === 0) {
      return undefined;
    }
    return Math.max(...this.getAllAprs(group));
  }

  computeAccumulatedStakings(group: FarmGroup): string {
    const positions = group.farms.map((farm) => farm.positions).flat();
    let stakings = new BigNumber(0);
    for (let i = 0; i < positions.length; i++) {
      stakings = stakings.plus(new BigNumber(positions[i].farmToken?.balance ?? 0));
    }

    return stakings.toFixed();
  }

  computeAccumulatedRewards(group: FarmGroup): string {
    const positions = group.farms.map((farm) => farm.positions).flat();
    let stakings = new BigNumber(0);
    for (let i = 0; i < positions.length; i++) {
      stakings = stakings.plus(new BigNumber(positions[i].rewardToken?.balance ?? 0));
    }

    return stakings.toFixed();
  }

  async computePositions(
    farmAddress: string,
    farmTokenId: string,
    rewardToken: NftCollection | EsdtToken,
    metaEsdts: (StakeFarmToken | UnbondFarmToken)[],
    vmQuery: boolean,
  ): Promise<Position[]> {
    const metaEsdt = metaEsdts.filter((metaEsdt) => {
      return metaEsdt.collection.trim() === farmTokenId;
    });

    const promises = metaEsdt.map(async (esdt) => {
      if (esdt.balance) {
        const rewards = await this.getRewardsForPosition(farmAddress, esdt, vmQuery);
        rewardToken.balance = rewards.toFixed();
      }

      return { farmToken: esdt, rewardToken: rewardToken } as Position;
    });

    return await Promise.all(promises);
  }

  async getRewardsForPosition(
    stakeAddress: string,
    esdt: StakeFarmToken | UnbondFarmToken,
    vmQuery: boolean,
  ): Promise<BigNumber> {
    if (!isStakeFarmToken(esdt) || !esdt.decodedAttributes || !esdt.balance || !esdt.attributes) {
      return new BigNumber(0);
    }

    const liquidity = esdt.balance;
    const attributes = esdt.attributes;

    let rewards: BigNumber;
    if (vmQuery) {
      rewards =
        (await this.stakingGetterService.calculateRewardsForGivenPosition(
          stakeAddress,
          liquidity,
          attributes,
        )) ?? new BigNumber(0);
    } else {
      rewards =
        (await this.computeFarmRewardsForPosition(
          stakeAddress,
          liquidity,
          esdt.decodedAttributes,
        )) ?? new BigNumber(0);
    }

    return rewards;
  }

  async computeFarmRewardsForPosition(
    farmAddress: string,
    liquidity: string,
    decodedAttributes: StakingTokenAttributesModel,
  ): Promise<BigNumber> {
    const [
      currentNonce,
      lastRewardBlockNonce,
      farmTokenSupply,
      perBlockRewardAmount,
      produceRewardsEnabled,
      maxApr,
      divisionSafetyConstant,
      rewardPerShare,
    ] = await Promise.all([
      this.stakingGetterService.getShardCurrentBlockNonce(
        AddressUtils.computeShard(AddressUtils.bech32Decode(farmAddress)),
      ),
      this.stakingGetterService.getLastRewardBlockNonce(farmAddress),
      this.stakingGetterService.getFarmTokenSupply(farmAddress),
      this.stakingGetterService.getRewardsPerBlock(farmAddress),
      this.stakingGetterService.getProduceRewardsEnabled(farmAddress),
      this.stakingGetterService.getAnnualPercentageRewards(farmAddress),
      this.stakingGetterService.getDivisionSafetyConstant(farmAddress),
      this.stakingGetterService.getRewardPerShare(farmAddress),
    ]);

    const attributesRewardsPerShareBig = new BigNumber(decodedAttributes.rewardPerShare ?? 0);
    const amountBig = new BigNumber(liquidity);
    const currentBlockBig = new BigNumber(currentNonce);
    const lastRewardBlockNonceBig = new BigNumber(lastRewardBlockNonce);
    const perBlockRewardAmountBig = new BigNumber(perBlockRewardAmount);
    const farmTokenSupplyBig = new BigNumber(farmTokenSupply);
    const rewardPerShareBig = new BigNumber(rewardPerShare);
    const maxAprBig = new BigNumber(maxApr);
    const divisionSafetyConstantBig = new BigNumber(divisionSafetyConstant);

    const rewardIncrease = this.calculateRewardIncrease(
      currentBlockBig,
      lastRewardBlockNonceBig,
      produceRewardsEnabled,
      perBlockRewardAmountBig,
      farmTokenSupplyBig,
      maxAprBig,
    );

    const rewardPerShareIncrease = this.calculateRewardPerShareIncrease(
      rewardIncrease,
      farmTokenSupplyBig,
      divisionSafetyConstantBig,
    );

    const futureRewardPerShare = rewardPerShareBig.plus(rewardPerShareIncrease);

    return this.calculateReward(
      amountBig,
      futureRewardPerShare,
      attributesRewardsPerShareBig,
      divisionSafetyConstantBig,
    );
  }

  calculateReward(
    amount: BigNumber,
    currentRewardPerShare: BigNumber,
    initialRewardPerShare: BigNumber,
    divisionSafetyConstant: BigNumber,
  ): BigNumber {
    if (currentRewardPerShare.isGreaterThan(initialRewardPerShare)) {
      const rewardPerShareDiff = currentRewardPerShare.minus(initialRewardPerShare);
      return amount
        .multipliedBy(rewardPerShareDiff)
        .dividedBy(divisionSafetyConstant)
        .integerValue();
    } else {
      return new BigNumber(0);
    }
  }

  calculateRewardPerShareIncrease(
    rewardIncrease: BigNumber,
    farmTokenSupply: BigNumber,
    divisionSafetyConstant: BigNumber,
  ): BigNumber {
    const result = rewardIncrease.multipliedBy(divisionSafetyConstant).dividedBy(farmTokenSupply);
    return result;
  }

  getAmountAprBounded(amount: BigNumber, maxApr: BigNumber): BigNumber {
    const maxPercent = new BigNumber(this.apiConfigService.getStakingMaxPercent());
    const blocksPerYear = new BigNumber(this.apiConfigService.getBlocksPerYear());
    const result = new BigNumber(amount)
      .multipliedBy(maxApr)
      .dividedBy(maxPercent)
      .dividedBy(blocksPerYear);
    return result;
  }

  calculatePerBlockRewards(
    currentBlockNonce: BigNumber,
    lastRewardBlockNonce: BigNumber,
    produceRewardsEnabled: boolean,
    perBlockRewardAmount: BigNumber,
  ): BigNumber {
    if (currentBlockNonce.isLessThanOrEqualTo(lastRewardBlockNonce) || !produceRewardsEnabled) {
      return new BigNumber(0);
    }

    const blockNonceDiff = currentBlockNonce.minus(lastRewardBlockNonce);
    const result = perBlockRewardAmount.multipliedBy(blockNonceDiff);
    return result;
  }

  calculateRewardIncrease(
    currentBlockNonce: BigNumber,
    lastRewardBlockNonce: BigNumber,
    produceRewardsEnabled: boolean,
    perBlockRewardAmount: BigNumber,
    farmTokenSupply: BigNumber,
    maxApr: BigNumber,
  ): BigNumber {
    const extraRewardsUnbounded = this.calculatePerBlockRewards(
      currentBlockNonce,
      lastRewardBlockNonce,
      produceRewardsEnabled,
      perBlockRewardAmount,
    );
    const extraRewardsAprBoundedPerBlock = this.getAmountAprBounded(
      farmTokenSupply,
      maxApr,
    ).multipliedBy(currentBlockNonce.minus(lastRewardBlockNonce));
    const rewardIncrease = BigNumber.minimum(extraRewardsUnbounded, extraRewardsAprBoundedPerBlock);
    return rewardIncrease;
  }
}
