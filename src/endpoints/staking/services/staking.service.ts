import { BinaryCodec } from '@elrondnetwork/erdjs/out';
import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { FarmAddresses } from 'src/models';
import {
  ChildFarmStakingContract,
  FarmStakingGroupContract,
} from 'src/models/staking/farm.staking.contract';
import { DecodeAttributesArgs } from '../../../models/staking/decoded.attrs';
import { Farm, Position } from '../../../models/staking/Farm';
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

@Injectable()
export class StakingService {
  constructor(
    private readonly stakingGetterService: StakingGetterService,
    private readonly stakingComputeService: StakingComputeService,
    private readonly metaEsdtService: MetaEsdtService,
    private readonly transactionService: TransactionsFarmService,
  ) {}

  async getFarms(address?: string, vmQuery?: boolean): Promise<Farm[]> {
    const farms: Farm[] = [];
    const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();
    const farmTokenIds = farmStakingGroups
      .map((group) => group.childContracts.map((childContract) => childContract.farmTokenId))
      .flat();
    const uniqueFarmTokenIds = [...new Set(farmTokenIds.map((id) => id))];

    const metaEsdtsDetails = (await this.getMetaEsdtsDetails(uniqueFarmTokenIds, address)) ?? [];
    const results = await Promise.all(
      farmStakingGroups.map((group) => {
        // the key is the farmingToken and it's used for O(1) lookup
        const knownFarms: Map<string, Farm> = new Map();
        return this.handleAddressesByGroupId(group, knownFarms, metaEsdtsDetails, vmQuery);
      }),
    );

    farms.push(...results.flat());

    return farms;
  }

  private async handleAddressesByGroupId(
    farmStakingGroup: FarmStakingGroupContract,
    knownFarms: Map<string, Farm>,
    metaEsdtsDetails: (StakeFarmToken | UnbondFarmToken)[],
    vmQuery?: boolean,
  ): Promise<Farm[]> {
    const addressesByGroupId = farmStakingGroup.childContracts;
    const groupId = farmStakingGroup.groupId;

    const results = await Promise.all(
      addressesByGroupId.map(async (childContract: ChildFarmStakingContract) => {
        const { farmingTokenId, areRewardsLocked, farmingToken, positions } =
          await this.getFarmInfo(childContract, metaEsdtsDetails, vmQuery);

        const farm =
          knownFarms.get(farmingTokenId) ??
          ({
            farmingToken,
            positions: Array<Position>(),
            groupId: groupId,
          } as Farm);

        farm.farmAddresses = {
          addressWithLockedRewards: areRewardsLocked
            ? childContract.farmAddress.toString()
            : farm.farmAddresses?.addressWithLockedRewards,
          addressWithUnlockedRewards: !areRewardsLocked
            ? childContract.farmAddress.toString()
            : farm.farmAddresses?.addressWithUnlockedRewards,
        };

        farm.positions.push(...positions);

        knownFarms.set(farmingTokenId, farm);

        return farm;
      }),
    );

    return results;
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

  async getApr(address: string) {
    const apr = await this.stakingComputeService.computeAnnualPercentageReward(address);
    return apr;
  }

  async getAnnualPercentageRewards(farmAddress: FarmAddresses) {
    let lockedApr = undefined;
    if (farmAddress.addressWithUnlockedRewards) {
      lockedApr = await this.stakingComputeService.computeAnnualPercentageReward(
        farmAddress.addressWithUnlockedRewards,
      );
    }

    let apr = undefined;
    if (farmAddress.addressWithUnlockedRewards) {
      apr = await this.stakingComputeService.computeAnnualPercentageReward(
        farmAddress.addressWithUnlockedRewards,
      );
    }
    return { apr, lockedApr };
  }

  async getFarmTokenSupply(farmAddress: FarmAddresses): Promise<string> {
    let totalLockedValue = new BigNumber(0);
    if (farmAddress.addressWithLockedRewards) {
      const farmTotalSupply = await this.stakingGetterService.getFarmTokenSupply(
        farmAddress.addressWithLockedRewards,
      );
      totalLockedValue = totalLockedValue.plus(new BigNumber(farmTotalSupply));
    }
    if (farmAddress.addressWithUnlockedRewards) {
      const farmTotalSupply = await this.stakingGetterService.getFarmTokenSupply(
        farmAddress.addressWithUnlockedRewards,
      );
      totalLockedValue = totalLockedValue.plus(new BigNumber(farmTotalSupply));
    }
    return totalLockedValue.toFixed();
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
