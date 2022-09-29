import {
  Address,
  AddressValue,
  BigUIntValue,
  BytesValue,
  Interaction,
  ResultsParser,
  TypedOutcomeBundle,
} from '@elrondnetwork/erdjs/out';
import { Inject, Injectable, Logger } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { StakeGoldElrondProxyService } from '../../elrond-communication/elrond-proxy.service';
import { STAKEGOLD_ELROND_PROXY_SERVICE } from '../../utils/constants';
import { generateRunQueryLogMessage } from '../../utils/generate-log-message';
import { SmartContractProfiler } from '../../utils/smartcontract.profiler';

@Injectable()
export class AbiStakingService {
  private readonly logger: Logger;
  private readonly resultParser: ResultsParser;

  constructor(
    @Inject(STAKEGOLD_ELROND_PROXY_SERVICE)
    private readonly elrondProxy: StakeGoldElrondProxyService,
  ) {
    this.logger = new Logger(AbiStakingService.name);
    this.resultParser = new ResultsParser();
  }

  async getGenericData(
    contract: SmartContractProfiler,
    interaction: Interaction,
  ): Promise<TypedOutcomeBundle> {
    try {
      const queryResponse = await contract.runQuery(
        this.elrondProxy.getService(),
        interaction.buildQuery(),
      );
      return this.resultParser.parseQueryResponse(queryResponse, interaction.getEndpoint());
    } catch (error: any) {
      const logMessage = generateRunQueryLogMessage(
        AbiStakingService.name,
        interaction.getEndpoint().name,
        error.message,
      );
      this.logger.error(logMessage);

      throw error;
    }
  }

  async calculateRewardsForGivenPosition(
    farmAddress: string,
    amount: string,
    attributes: string,
  ): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
    const interaction: Interaction = contract.methodsExplicit.calculateRewardsForGivenPosition([
      new BigUIntValue(new BigNumber(amount)),
      BytesValue.fromHex(Buffer.from(attributes, 'base64').toString('hex')),
    ]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf();
  }

  async getFarmTokenSupply(farmAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
    const interaction: Interaction = contract.methods.getFarmTokenSupply([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf().toFixed();
  }

  async getAnnualPercentageRewards(farmAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
    const interaction: Interaction = contract.methods.getAnnualPercentageRewards([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf()?.toFixed();
  }

  async getPerBlockRewardAmount(farmAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
    const interaction: Interaction = contract.methods.getPerBlockRewardAmount([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf().toFixed();
  }

  async getLastRewardBlockNonce(farmAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
    const interaction: Interaction = contract.methods.getLastRewardBlockNonce([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf().toFixed();
  }

  async getUndistributedFees(farmAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);

    const interaction: Interaction = contract.methods.getUndistributedFees([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf().toFixed();
  }

  async getCurrentBlockFee(farmAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);

    const interaction: Interaction = contract.methods.getCurrentBlockFee([]);
    const response = await this.getGenericData(contract, interaction);
    const currentBlockFee = response.firstValue?.valueOf();
    return currentBlockFee ? currentBlockFee[1].toFixed() : '0';
  }

  async getRewardsPerBlock(farmAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
    const interaction: Interaction = contract.methods.getPerBlockRewardAmount([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf().toFixed();
  }

  async getDivisionSafetyConstant(farmAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
    const interaction: Interaction = contract.methods.getDivisionSafetyConstant([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf().toFixed();
  }

  async getProduceRewardsEnabled(farmAddress: string): Promise<boolean> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
    const interaction: Interaction = contract.methods.isProduceRewardsEnabled([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf() ?? true;
  }

  async getRewardPerShare(farmAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(farmAddress);
    const interaction: Interaction = contract.methods.getRewardPerShare([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf().toFixed();
  }

  async getGroupIdentifiers(): Promise<string[]> {
    const contract = await this.elrondProxy.getRouterSmartContract();
    const interaction: Interaction = contract.methods.getGroupIdentifiers([]);
    const response = await this.getGenericData(contract, interaction);
    return (response.firstValue?.valueOf() as any[]).map((group) => group.toString()) ?? [];
  }

  async getAddressesByGroupId(groupId: string): Promise<string[]> {
    const contract = await this.elrondProxy.getRouterSmartContract();
    const interaction: Interaction = contract.methodsExplicit.getAddressesByGroupIdentifier([
      new BytesValue(Buffer.from(groupId)),
    ]);
    const response = await this.getGenericData(contract, interaction);
    return (response.firstValue?.valueOf() as Address[]).map((address) => address.toString());
  }

  async getGroupByOwner(address: string): Promise<string | undefined> {
    const contract = await this.elrondProxy.getRouterSmartContract();
    const interaction: Interaction = contract.methodsExplicit.getGroupByOwner([
      new AddressValue(new Address(address)),
    ]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf().toString();
  }

  async getVestingAddressByGroupIdentifier(groupId: string): Promise<string> {
    console.log('getVestingAddressByGroupIdentifier for group ', groupId);
    const contract = await this.elrondProxy.getRouterSmartContract();
    const interaction: Interaction = contract.methodsExplicit.getVestingAddressByGroupIdentifier([
      new BytesValue(Buffer.from(groupId)),
    ]);
    const response = await this.getGenericData(contract, interaction);
    console.log(
      'getVestingAddressByGroupIdentifier value = ',
      response.firstValue?.valueOf()?.toString(),
    );
    return response.firstValue?.valueOf()?.toString();
  }

  async getLockedAssetTokenId(vestingAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getVestingSmartContract(vestingAddress);
    const interaction: Interaction = contract.methods.getLockedAssetTokenId([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf()?.toString();
  }

  async getFarmTokenId(childContractAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(childContractAddress);
    const interaction: Interaction = contract.methods.getFarmTokenIdentifier([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf();
  }

  async getFarmingTokenId(childContractAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(childContractAddress);
    const interaction: Interaction = contract.methods.getFarmingTokenId([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf();
  }

  async getRewardTokenId(childContractAddress: string): Promise<string> {
    const contract = await this.elrondProxy.getFarmSmartContract(childContractAddress);
    const interaction: Interaction = contract.methods.getRewardTokenId([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf();
  }

  async areRewardsLocked(childContractAddress: string): Promise<boolean> {
    const contract = await this.elrondProxy.getFarmSmartContract(childContractAddress);
    const interaction: Interaction = contract.methods.areRewardsLocked([]);
    const response = await this.getGenericData(contract, interaction);
    return response.firstValue?.valueOf();
  }
}
