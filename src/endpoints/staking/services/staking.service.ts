import { BinaryCodec } from '@elrondnetwork/erdjs/out';
import { Injectable } from '@nestjs/common';
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
import { isNftCollection } from '../../../models/meta-esdt';
import { FarmStaking } from '../../../models/staking';

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
    console.log('farmStakingGroups', JSON.stringify(farmStakingGroups));
    const farmTokenIds = farmStakingGroups
      .map((group) => group.childContracts.map((childContract) => childContract.farmTokenId))
      .flat();
    const uniqueFarmTokenIds = [...new Set(farmTokenIds.map((id) => id))];
    const metaEsdtsDetails = (await this.getMetaEsdtsDetails(uniqueFarmTokenIds, address)) ?? [];

    await Promise.all(
      farmStakingGroups.map(async (group) => {
        const farms = (await this.handleAddressesByGroupId(group, metaEsdtsDetails, vmQuery)) ?? [];

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
          farmingToken,
        } as FarmGroup);
      }),
    );

    return groups;
  }

  private async handleAddressesByGroupId(
    farmStakingGroup: FarmStakingGroupContract,
    metaEsdtsDetails: (StakeFarmToken | UnbondFarmToken)[],
    vmQuery?: boolean,
  ): Promise<Farm[]> {
    // the key is the farmingToken and it's used for O(1) lookup
    const knownFarms: Map<string, Farm> = new Map();

    const addressesByGroupId = farmStakingGroup.childContracts;

    await Promise.all(
      addressesByGroupId.map(async (childContract: ChildFarmStakingContract) => {
        const { farmingTokenId, areRewardsLocked, rewardToken, farmingToken, positions } =
          await this.getFarmInfo(childContract, metaEsdtsDetails, vmQuery);

        const farm =
          knownFarms.get(farmingTokenId) ??
          ({
            farmingToken,
            positions: Array<Position>(),
          } as Farm);

        farm.farmStaking = {
          addressWithLockedRewards: areRewardsLocked
            ? childContract.farmAddress.toString()
            : farm.farmStaking?.addressWithLockedRewards,
          addressWithUnlockedRewards: !areRewardsLocked
            ? childContract.farmAddress.toString()
            : farm.farmStaking?.addressWithUnlockedRewards,
        };

        farm.unlockedRewardToken = areRewardsLocked ? rewardToken : farm.unlockedRewardToken;
        farm.lockedRewardToken = !areRewardsLocked ? rewardToken : farm.lockedRewardToken;

        const { apr, lockedApr } = await this.getAnnualPercentageRewards(farm.farmStaking);
        farm.apr = apr;
        farm.lockedApr = lockedApr;

        farm.positions.push(...positions);

        knownFarms.set(farmingTokenId, farm);
      }),
    );

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
    if (farmStaking.addressWithUnlockedRewards) {
      lockedApr = await this.stakingComputeService.computeAnnualPercentageReward(
        farmStaking.addressWithUnlockedRewards,
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
        const unboundFarmTokenAttributes = new UnbondTokenAttributesModel({
          identifier: arg.identifier,
          attributes: arg.attributes,
          remainingEpochs,
        });

        decodedAttributesBatch.push(unboundFarmTokenAttributes);
      }
    } catch (e) {
      console.error(e);
    }

    return decodedAttributesBatch;
  }

  private async getUnbondigRemaingEpochs(unlockEpoch: number): Promise<number> {
    const currentEpoch = await this.stakingGetterService.getCurrentEpoch();

    return unlockEpoch - currentEpoch > 0 ? unlockEpoch - currentEpoch : 0;
  }

  async stake(sender: string, args: StakingArgs): Promise<Transaction> {
    return await this.transactionService.stake(sender, args);
  }

  async unstake(sender: string, args: UnstakingArgs): Promise<Transaction> {
    return await this.transactionService.unstake(sender, args);
  }

  async unbond(sender: string, args: StakingArgs): Promise<Transaction> {
    return await this.transactionService.unbond(sender, args);
  }

  async reinvest(sender: string, args: StakingArgs): Promise<Transaction> {
    return await this.transactionService.reinvest(sender, args);
  }

  async harvest(sender: string, args: StakingArgs): Promise<Transaction> {
    return await this.transactionService.harvest(sender, args);
  }
}
