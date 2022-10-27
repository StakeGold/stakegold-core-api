import { BinaryCodec } from '@elrondnetwork/erdjs/out';
import { BadRequestException, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import {
  ChildFarmStakingContract,
  FarmStakingGroupContract,
} from 'src/models/staking/farm.staking.contract';
import { DecodeAttributesArgs } from '../../../models/staking/decoded.attrs';
import { Farm, FarmGroup, Position } from '../../../models/staking/Farm';
import { StakeFarmToken } from '../../../models/staking/stakeFarmToken.model';
import { StakingArgs, UnstakingArgs } from '../../../models/staking/staking.args';
import {
  StakingTokenAttributesModel,
  UnbondTokenAttributesModel,
} from '../../../models/staking/stakingTokenAttributes.model';
import { Transaction } from '../../../models/staking/transaction.model';
import { UnbondFarmToken } from '../../../models/staking/unbondFarmToken.model';
import { MetaEsdtService } from '../../meta-esdt/meta.esdt.service';
import { StakingComputeService } from './staking.compute.service';
import { StakingGetterService } from './staking.getter.service';
import { TransactionsFarmService } from './transactions-farm.service';
import { isNftCollection, NftCollection } from '../../../models/meta-esdt';
import { FarmStaking, InputToken } from '../../../models/staking';
import { calcUnlockDateText } from '../../utils';
import { EsdtToken } from 'src/models';

@Injectable()
export class StakingService {
  constructor(
    private readonly stakingGetterService: StakingGetterService,
    private readonly stakingComputeService: StakingComputeService,
    private readonly metaEsdtService: MetaEsdtService,
    private readonly transactionService: TransactionsFarmService,
  ) {}

  async getFarms(address?: string, vmQuery?: boolean): Promise<FarmGroup[]> {
    const groups: FarmGroup[] = [];
    const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();
    const farmTokenIds = farmStakingGroups
      .map((group) => group.childContracts.map((childContract) => childContract.farmTokenId))
      .flat();
    const uniqueFarmTokenIds = [...new Set(farmTokenIds.map((id) => id))];
    const metaEsdtsDetails = (await this.getMetaEsdtsDetails(uniqueFarmTokenIds, address)) ?? [];

    await Promise.all(
      farmStakingGroups.map(async (group) => {
        const farms = (await this.handleAddressesByGroupId(group, metaEsdtsDetails, vmQuery)) ?? [];

        const farmingTokens = await this.getGroupFarmingTokens(group.groupId, farms);

        const farmingToken =
          farms.find((farm) => !isNftCollection(farm.farmingToken))?.farmingToken ??
          farms.firstOrUndefined()?.farmingToken;
        const decimals = farmingToken?.decimals ?? 0;
        const icon = farmingToken?.assets?.svgUrl;

        groups.push({
          groupId: group.groupId,
          farms,
          groupName: this.getGroupName(farms),
          groupDecimals: decimals,
          groupIcon: icon,
          farmingTokens,
        } as FarmGroup);
      }),
    );

    return groups;
  }

  private async getGroupFarmingTokens(
    groupId: string,
    farms: Farm[],
  ): Promise<(NftCollection | EsdtToken)[]> {
    const farmingTokens: (NftCollection | EsdtToken)[] = [];
    const lockedFarmingToken = await this.getGroupUnlockedFarmingToken(groupId, farms);
    const unlockedFarmingToken = this.getGroupLockedFarmingToken(farms);

    if (lockedFarmingToken) {
      farmingTokens.push(lockedFarmingToken);
    }

    if (unlockedFarmingToken) {
      farmingTokens.push(unlockedFarmingToken);
    }

    return farmingTokens;
  }

  private async getGroupUnlockedFarmingToken(
    groupId: string,
    farms: Farm[],
  ): Promise<EsdtToken | NftCollection | undefined> {
    const unlockedFarmingToken = farms.find(
      (farm) => !isNftCollection(farm.farmingToken),
    )?.farmingToken;

    if (unlockedFarmingToken) {
      return unlockedFarmingToken;
    }

    const rewardTokenId = await this.stakingGetterService.getRewardTokenIdByGroupIdentifier(
      groupId,
    );
    return this.stakingGetterService.getEsdtOrNft(rewardTokenId);
  }

  private getGroupLockedFarmingToken(farms: Farm[]): EsdtToken | NftCollection | undefined {
    const lockedFarmingToken = farms.find((farm) =>
      isNftCollection(farm.farmingToken),
    )?.farmingToken;
    return lockedFarmingToken;
  }

  private async handleAddressesByGroupId(
    farmStakingGroup: FarmStakingGroupContract,
    metaEsdtsDetails: (StakeFarmToken | UnbondFarmToken)[],
    vmQuery?: boolean,
  ): Promise<Farm[]> {
    // the key is the farmingToken and it's used for O(1) lookup
    const knownFarms: Map<string, Farm> = new Map();

    const addressesByGroupId = farmStakingGroup.childContracts;

    for (const childContract of addressesByGroupId) {
      const { farmingTokenId, areRewardsLocked, rewardToken, farmingToken, positions } =
        await this.getFarmInfo(childContract, metaEsdtsDetails, vmQuery);

      let farm: Farm;
      const foundFarm = knownFarms.get(farmingTokenId);
      if (foundFarm) {
        farm = foundFarm;
      } else {
        farm = {
          farmingToken,
          positions: Array<Position>(),
        } as Farm;
      }

      farm.farmStaking = {
        addressWithLockedRewards: areRewardsLocked
          ? childContract.farmAddress.toString()
          : farm.farmStaking?.addressWithLockedRewards,
        addressWithUnlockedRewards: !areRewardsLocked
          ? childContract.farmAddress.toString()
          : farm.farmStaking?.addressWithUnlockedRewards,
      };

      farm.lockedRewardToken = areRewardsLocked ? rewardToken : farm.lockedRewardToken;
      farm.unlockedRewardToken = !areRewardsLocked ? rewardToken : farm.unlockedRewardToken;

      const { apr, lockedApr } = await this.getAnnualPercentageRewards(farm.farmStaking);
      farm.apr = apr ? Math.floor(apr) : undefined;
      farm.lockedApr = lockedApr ? Math.floor(lockedApr) : undefined;

      farm.positions.push(...positions);

      knownFarms.set(farmingTokenId, farm);
    }

    return Array.from(knownFarms.values());
  }

  private async getFarmInfo(
    childFarmStakingContract: ChildFarmStakingContract,
    metaEsdtsDetails: (StakeFarmToken | UnbondFarmToken)[],
    vmQuery?: boolean,
  ): Promise<any> {
    const farmAddress = childFarmStakingContract.farmAddress;
    const farmingTokenId = childFarmStakingContract.farmingTokenId;
    const areRewardsLocked = childFarmStakingContract.areRewardsLocked;

    const [farmingToken, rewardToken] = await Promise.all([
      await this.stakingGetterService.getEsdtOrNft(childFarmStakingContract.farmingTokenId),
      await this.stakingGetterService.getEsdtOrNft(childFarmStakingContract.rewardTokenId),
    ]);

    let positions: Position[] = [];
    if (rewardToken) {
      positions = await this.stakingComputeService.computePositions(
        farmAddress,
        childFarmStakingContract.farmTokenId,
        rewardToken,
        metaEsdtsDetails,
        vmQuery ?? false,
      );
    }

    return {
      farmingTokenId,
      areRewardsLocked,
      rewardToken,
      farmingToken,
      positions,
    };
  }

  async getMetaEsdtsDetails(
    farmTokens: string[],
    address?: string,
  ): Promise<(StakeFarmToken | UnbondFarmToken)[]> {
    if (!address) {
      return [];
    }

    const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, farmTokens);

    const promises = metaEsdts.map(async (metaEsdt) => {
      const stakeDecodedAttributes = this.decodeStakingTokenAttributes({
        batchAttributes: [
          {
            attributes: metaEsdt.attributes,
            identifier: metaEsdt.identifier,
          },
        ],
      });
      if (stakeDecodedAttributes && stakeDecodedAttributes.length > 0) {
        const stakeFarmToken = metaEsdt as StakeFarmToken;
        stakeFarmToken.decodedAttributes = stakeDecodedAttributes[0];
        return stakeFarmToken;
      } else {
        const unbondDecodedAttributes = await this.decodeUnboundTokenAttributes({
          batchAttributes: [
            {
              attributes: metaEsdt.attributes,
              identifier: metaEsdt.identifier,
            },
          ],
        });
        const unbondFarmToken = metaEsdt as UnbondFarmToken;
        if (unbondDecodedAttributes && unbondDecodedAttributes.length > 0) {
          unbondFarmToken.decodedAttributes = unbondDecodedAttributes[0];
        }

        return unbondFarmToken;
      }
    });

    return await Promise.all(promises);
  }

  private async getAnnualPercentageRewards(farmStaking: FarmStaking) {
    let lockedApr = undefined;
    if (farmStaking.addressWithLockedRewards) {
      lockedApr = await this.stakingComputeService.computeAnnualPercentageReward(
        farmStaking.addressWithLockedRewards,
      );
    }

    let apr = undefined;
    if (farmStaking.addressWithUnlockedRewards) {
      apr = await this.stakingComputeService.computeAnnualPercentageReward(
        farmStaking.addressWithUnlockedRewards,
      );
    }
    return { apr, lockedApr };
  }

  getGroupName(farms: Farm[]): string {
    let groupName = '';
    for (let i = 0; i < farms.length; i++) {
      const ticker = farms[i].farmingToken?.ticker.split('-');
      if (ticker.length > 0) {
        const name = ticker[0];
        groupName += name;
        if (i !== farms.length - 1) {
          groupName += ' / ';
        }
      }
    }

    return groupName;
  }

  async getGroupTotalSupply(group: FarmGroup): Promise<string> {
    let totalLockedValue = new BigNumber(0);
    for (const farm of group.farms) {
      const farmStaking = farm.farmStaking;
      if (farmStaking.addressWithLockedRewards) {
        const lockedRewardsTotalSupply = await this.getFarmTotalSupply(
          farmStaking.addressWithLockedRewards,
        );
        totalLockedValue = totalLockedValue.plus(new BigNumber(lockedRewardsTotalSupply));
      }
      if (farmStaking.addressWithUnlockedRewards) {
        const unlockedRewardsTotalSupply = await this.getFarmTotalSupply(
          farmStaking.addressWithUnlockedRewards,
        );
        totalLockedValue = totalLockedValue.plus(new BigNumber(unlockedRewardsTotalSupply));
      }
    }
    return totalLockedValue.toFixed();
  }

  async getFarmTotalSupply(farmAddress?: string): Promise<string> {
    if (!farmAddress) {
      return '0';
    }
    return await this.stakingGetterService.getFarmTokenSupply(farmAddress);
  }

  decodeStakingTokenAttributes(args: DecodeAttributesArgs): StakingTokenAttributesModel[] {
    try {
      return args.batchAttributes.map((arg) => {
        const attributesBuffer = Buffer.from(arg.attributes ?? '', 'base64');
        const codec = new BinaryCodec();
        const structType = StakingTokenAttributesModel.getStructure();
        const [decoded] = codec.decodeNested(attributesBuffer, structType);
        const decodedAttributes = decoded.valueOf();
        const stakingTokenAttributes =
          StakingTokenAttributesModel.fromDecodedAttributes(decodedAttributes);

        stakingTokenAttributes.identifier = arg.identifier;
        stakingTokenAttributes.attributes = arg.attributes;

        return stakingTokenAttributes;
      });
    } catch (e) {
      return [];
    }
  }

  async decodeUnboundTokenAttributes(
    args: DecodeAttributesArgs,
  ): Promise<UnbondTokenAttributesModel[]> {
    const decodedAttributesBatch = [];
    try {
      for (const arg of args.batchAttributes) {
        const attributesBuffer = Buffer.from(arg.attributes ?? '', 'base64');
        const codec = new BinaryCodec();
        const structType = UnbondTokenAttributesModel.getStructure();
        const [decoded] = codec.decodeNested(attributesBuffer, structType);
        const decodedAttributes = decoded.valueOf();
        const remainingEpochs = await this.getUnbondigRemaingEpochs(
          decodedAttributes.unlockEpoch.toNumber(),
        );
        const unlockDate = await this.getUnlockDate(remainingEpochs);
        const unboundFarmTokenAttributes = new UnbondTokenAttributesModel({
          identifier: arg.identifier,
          attributes: arg.attributes,
          remainingEpochs,
          unlockDate,
        });

        decodedAttributesBatch.push(unboundFarmTokenAttributes);
      }
    } catch (e) {
      console.error(e);
    }

    return decodedAttributesBatch;
  }

  private async getUnlockDate(remainingEpochs?: number): Promise<string | undefined> {
    if (remainingEpochs === undefined) {
      return undefined;
    }

    const stats = await this.stakingGetterService.getStats();
    const { unlocksAtDate, unlocksAtText } = calcUnlockDateText({
      epochs: remainingEpochs,
      stats,
      hasSteps: false,
    });

    return `${unlocksAtText} ${unlocksAtDate}`?.trim();
  }

  private async getUnbondigRemaingEpochs(unlockEpoch: number): Promise<number> {
    const currentEpoch = (await this.stakingGetterService.getStats())?.epoch;

    return unlockEpoch - currentEpoch > 0 ? unlockEpoch - currentEpoch : 0;
  }

  async stake(sender: string, groupId: string, args: StakingArgs): Promise<Transaction> {
    return await this.transactionService.stake(sender, groupId, args);
  }

  async lockAndStake(
    sender: string,
    groupId: string,
    stakingArgs: StakingArgs,
  ): Promise<Transaction> {
    const groupIdentifiers = await this.stakingGetterService.getGroupIdentifiers();
    if (!groupIdentifiers.includes(groupId)) {
      throw new BadRequestException('The given group does not exist');
    }

    return await this.transactionService.lockAndStake(sender, groupId, stakingArgs);
  }

  async mergeTokens(sender: string, tokens: InputToken[]): Promise<Transaction> {
    return await this.transactionService.mergeTokens(sender, tokens);
  }

  async unlockToken(sender: string, token: InputToken): Promise<Transaction> {
    return await this.transactionService.unlockToken(sender, token);
  }

  async unstake(sender: string, args: UnstakingArgs): Promise<Transaction> {
    return await this.transactionService.unstake(sender, args);
  }

  async unbond(sender: string, args: StakingArgs): Promise<Transaction> {
    return await this.transactionService.unbond(sender, args);
  }

  async reinvest(sender: string, args: StakingArgs): Promise<Transaction[]> {
    return await this.transactionService.reinvest(sender, args);
  }

  async harvest(sender: string, args: StakingArgs): Promise<Transaction[]> {
    return await this.transactionService.harvest(sender, args);
  }
}
