import { BinaryCodec } from "@elrondnetwork/erdjs/out";
import { Inject, Injectable } from "@nestjs/common";
import BigNumber from "bignumber.js";
import { DecodeAttributesArgs } from "../../../models/staking/decoded.attrs";
import { Farm } from "../../../models/staking/Farm";
import { FarmAddress } from "../../../models/staking/farm.address";
import { FarmInfo } from "../../../models/staking/farm.info";
import { StakeFarmToken } from "../../../models/staking/stakeFarmToken.model";
import {
  StakingArgs,
  UnstakingArgs,
} from "../../../models/staking/staking.args";
import {
  StakingTokenAttributesModel,
  UnbondTokenAttributesModel,
} from "../../../models/staking/stakingTokenAttributes.model";
import { TransactionModel } from "../../../models/staking/transaction.model";
import { UnbondFarmToken } from "../../../models/staking/unbondFarmToken.model";
import { StakeGoldApiConfigService } from "../../api-config/api-config.service";
import { MetaEsdtService } from "../../meta-esdt/meta.esdt.service";
import {
  STAKEGOLD_API_CONFIG_SERVICE,
  STAKING_OPTIONS,
} from "../../utils/constants";
import { StakingModuleOptions } from "../options/staking.module.options";
import { StakingComputeService } from "./staking.compute.service";
import { StakingGetterService } from "./staking.getter.service";
import { TransactionsFarmService } from "./transactions-farm.service";

@Injectable()
export class StakingService {
  constructor(
    private readonly stakingGetterService: StakingGetterService,
    private readonly stakingComputeService: StakingComputeService,
    private readonly metaEsdtService: MetaEsdtService,
    @Inject(STAKEGOLD_API_CONFIG_SERVICE)
    private readonly apiConfigService: StakeGoldApiConfigService,
    private readonly transactionService: TransactionsFarmService,
    @Inject(STAKING_OPTIONS) private options: StakingModuleOptions
  ) {}

  /**
  * @deprecated The method should not be used
  */
  async getFarmsOld(address?: string, vmQuery?: boolean): Promise<Farm[]> {
    const farmTokens = (await this.getMetaEsdtsDetails(address)) ?? [];

    const farms: Farm[] = [];
    for (const info of this.options.farmsInfo) {
      const farmingToken = info.farmingToken;
      const farmAddress = this.getFarmAddresses(info);
      const farmTotalSupply = await this.getFarmTokenSupply(farmAddress);
      const annualPercentageRewards = await this.getAnnualPercentageRewards(
        farmAddress
      );
      const lockedApr = annualPercentageRewards.lockedApr;
      const apr = annualPercentageRewards.apr;
      const positions = await this.stakingComputeService.computePositions(
        info,
        farmTokens,
        vmQuery ?? false
      );
      const accumulatedRewards =
        this.stakingComputeService.computeAccumulatedRewards(positions);
      const accumulatedStakings =
        this.stakingComputeService.computeAccumulatedStakings(positions);

      farms.push(
        {
          farmAddress: farmAddress,
          address: address,
          vmQuery: vmQuery,
          farmingToken,
          farmTotalSupply,
          lockedApr,
          apr,
          positions,
          accumulatedRewards,
          accumulatedStakings,
        } as Farm
      );
    }

    return farms;
  }

  async getFarms(address?: string, vmQuery?: boolean): Promise<Farm[]> {
    const farms: Array<Farm> = [];

    const farmTokens = (await this.getMetaEsdtsDetails(address)) ?? [];

    for (const farmInfo of this.options.farmsInfo) {
        const positions = await this.stakingComputeService.computePositions(
          farmInfo,
          farmTokens,
          vmQuery ?? false
        );

        farms.push(
            {
              farmAddress: this.getFarmAddresses(farmInfo),
              positions: positions,
              farmingToken: farmInfo.farmingToken,
              address: address,
              vmQuery: vmQuery,
            } as Farm,
        );
    }

    return farms;
  }

  async getMetaEsdtsDetails(
    address?: string
  ): Promise<(StakeFarmToken | UnbondFarmToken)[]> {
    if (!address) {
      return [];
    }

    const farmTokensAddressMap = this.apiConfigService.getFarmTokens();
    const farmTokensAddress = Array.from(Object.keys(farmTokensAddressMap));

    const metaEsdts = await this.metaEsdtService.getMetaEsdts(
      address,
      farmTokensAddress
    );

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
        const stakeFarmToken =  metaEsdt as StakeFarmToken;
        stakeFarmToken.decodedAttributes = stakeDecodedAttributes[0];
        return stakeFarmToken;
      } else {
        const unbondDecodedAttributes = await this.decodeUnboundTokenAttributes(
          {
            batchAttributes: [
              {
                attributes: metaEsdt.attributes,
                identifier: metaEsdt.identifier,
              },
            ],
          }
        );
        const unbondFarmToken =  metaEsdt as UnbondFarmToken;
        if (unbondDecodedAttributes && unbondDecodedAttributes.length > 0) {
          unbondFarmToken.decodedAttributes = unbondDecodedAttributes[0];
        }

        return unbondFarmToken;
      }
    });

    return await Promise.all(promises);
  }

  async getApr(address: string) {
    const apr = await this.stakingComputeService.computeAnnualPercentageReward(
      address
    );
    return apr;
  }

  async getAnnualPercentageRewards(farmAddress: FarmAddress) {
    let lockedApr = undefined;
    if (farmAddress.lockedRewardsAddress) {
      lockedApr =
        await this.stakingComputeService.computeAnnualPercentageReward(
          farmAddress.lockedRewardsAddress
        );
    }

    let apr = undefined;
    if (farmAddress.unlockedRewardsAddress) {
      apr = await this.stakingComputeService.computeAnnualPercentageReward(
        farmAddress.unlockedRewardsAddress
      );
    }
    return { apr, lockedApr };
  }

  async getFarmTokenSupply(farmAddress: FarmAddress): Promise<string> {
    let totalLockedValue = new BigNumber(0);
    if (farmAddress.lockedRewardsAddress) {
      const farmTotalSupply =
        await this.stakingGetterService.getFarmTokenSupply(
          farmAddress.lockedRewardsAddress
        );
      totalLockedValue = totalLockedValue.plus(new BigNumber(farmTotalSupply));
    }
    if (farmAddress.unlockedRewardsAddress) {
      const farmTotalSupply =
        await this.stakingGetterService.getFarmTokenSupply(
          farmAddress.unlockedRewardsAddress
        );
      totalLockedValue = totalLockedValue.plus(new BigNumber(farmTotalSupply));
    }
    return totalLockedValue.toFixed();
  }

  private getFarmAddresses(farmInfo: FarmInfo) {
    const unlockedRewardsAddress = farmInfo.unlockedRewards?.address;
    const lockedRewardsAddress = farmInfo.lockedRewards?.address;

    return { unlockedRewardsAddress, lockedRewardsAddress } as FarmAddress;
  }

  decodeStakingTokenAttributes(
    args: DecodeAttributesArgs
  ): StakingTokenAttributesModel[] {
    try {
      return args.batchAttributes.map((arg) => {
        const attributesBuffer = Buffer.from(arg.attributes ?? "", "base64");
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
    args: DecodeAttributesArgs
  ): Promise<UnbondTokenAttributesModel[]> {
    const decodedAttributesBatch = [];
    try {
      for (const arg of args.batchAttributes) {
        const attributesBuffer = Buffer.from(arg.attributes ?? "", "base64");
        const codec = new BinaryCodec();
        const structType = UnbondTokenAttributesModel.getStructure();
        const [decoded] = codec.decodeNested(attributesBuffer, structType);
        const decodedAttributes = decoded.valueOf();
        const remainingEpochs = await this.getUnbondigRemaingEpochs(
          decodedAttributes.unlockEpoch.toNumber()
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

  async stake(sender: string, args: StakingArgs): Promise<TransactionModel> {
    return await this.transactionService.stake(sender, args);
  }

  async unstake(
    sender: string,
    args: UnstakingArgs
  ): Promise<TransactionModel> {
    return await this.transactionService.unstake(sender, args);
  }

  async unbond(sender: string, args: StakingArgs): Promise<TransactionModel> {
    return await this.transactionService.unbond(sender, args);
  }

  async reinvest(sender: string, args: StakingArgs): Promise<TransactionModel> {
    return await this.transactionService.reinvest(sender, args);
  }

  async harvest(sender: string, args: StakingArgs): Promise<TransactionModel> {
    return await this.transactionService.harvest(sender, args);
  }
}
