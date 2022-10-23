import { Address, BooleanValue, BytesValue, TypedValue, U32Value } from '@elrondnetwork/erdjs/out';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { InputToken } from '../../../models/staking';
import { StakingArgs, TransactionArgs, UnstakingArgs } from '../../../models/staking/staking.args';
import { Transaction } from '../../../models/staking/transaction.model';
import { StakeGoldApiConfigService } from '../../api-config/api-config.service';
import { ContextTransactionsService } from '../../context/context.transactions.service';
import { StakeGoldElrondProxyService } from '../../elrond-communication/elrond-proxy.service';
import { AddressUtils } from '../../utils/address.utils';
import {
  STAKEGOLD_API_CONFIG_SERVICE,
  STAKEGOLD_ELROND_PROXY_SERVICE,
} from '../../utils/constants';
import { StakingGetterService } from './staking.getter.service';

@Injectable()
export class TransactionsFarmService {
  constructor(
    @Inject(STAKEGOLD_ELROND_PROXY_SERVICE)
    private readonly elrondProxy: StakeGoldElrondProxyService,
    private readonly contextTransactions: ContextTransactionsService,
    @Inject(STAKEGOLD_API_CONFIG_SERVICE)
    private readonly apiConfigService: StakeGoldApiConfigService,
    private readonly stakingGetterService: StakingGetterService,
  ) {}

  async stake(sender: string, groupId: string, args: StakingArgs): Promise<Transaction> {
    const contract = await this.elrondProxy.getRouterSmartContract();

    if (!AddressUtils.isAddressValid(sender)) {
      throw new BadRequestException('Provided address is not a valid bech32 address');
    }

    const method = 'stakeFarm';
    const gasLimit = 30000000;

    if (args.tokens.length > 1) {
      return this.contextTransactions.multiESDTNFTTransfer(
        new Address(sender),
        contract,
        args.tokens,
        method,
        [BytesValue.fromUTF8(groupId), new BooleanValue(args.lockRewards)],
        gasLimit,
        this.apiConfigService.getChainId(),
      );
    }

    const collection = args.tokens[0].collection;
    if (collection === undefined || collection === '') {
      return this.contextTransactions.esdtTransfer(
        contract,
        args.tokens[0],
        method,
        [BytesValue.fromUTF8(groupId), new BooleanValue(args.lockRewards)],
        gasLimit,
        this.apiConfigService.getChainId(),
      );
    }

    return this.SftFarmInteraction(sender, args, method, gasLimit, [
      new BooleanValue(args.lockRewards),
    ]);
  }

  async lockAndStake(sender: string, groupId: string, args: StakingArgs): Promise<Transaction> {
    const contract = await this.elrondProxy.getRouterSmartContract();

    if (!AddressUtils.isAddressValid(sender)) {
      throw new BadRequestException('Provided address is not a valid bech32 address');
    }

    const method = 'lockAssetsAndStakeFarm';
    const gasLimit = 40000000;

    if (args.tokens.length > 1) {
      return this.contextTransactions.multiESDTNFTTransfer(
        new Address(sender),
        contract,
        args.tokens,
        method,
        [new BooleanValue(args.lockRewards), BytesValue.fromUTF8(groupId)],
        gasLimit,
        this.apiConfigService.getChainId(),
      );
    }

    const collection = args.tokens[0].collection;
    if (collection === undefined || collection === '') {
      return this.contextTransactions.esdtTransfer(
        contract,
        args.tokens[0],
        method,
        [new BooleanValue(args.lockRewards), BytesValue.fromUTF8(groupId)],
        gasLimit,
        this.apiConfigService.getChainId(),
      );
    }

    return this.SftFarmInteraction(sender, args, method, gasLimit, [
      new BooleanValue(args.lockRewards),
      BytesValue.fromUTF8(groupId),
    ]);
  }

  async mergeTokens(sender: string, tokens: InputToken[]): Promise<Transaction> {
    const contract = await this.elrondProxy.getRouterSmartContract();

    if (!AddressUtils.isAddressValid(sender)) {
      throw new BadRequestException('Provided address is not a valid bech32 address');
    }

    if (tokens.length === 0) {
      throw new BadRequestException('Provided tokens list cannot be empty');
    }

    const gasLimit = new BigNumber(4000000).times(tokens.length).plus(12000000).toNumber();

    const vestingAddress = await this.stakingGetterService.getGroupIdFromLockedAssetId(
      tokens[0].identifier,
    );

    if (!vestingAddress) {
      throw new BadRequestException(`The vesting address hasn't been set yet`);
    }

    return this.contextTransactions.multiESDTNFTTransfer(
      new Address(sender),
      contract,
      tokens,
      'mergeLockedAssetTokens',
      [BytesValue.fromHex(Address.fromBech32(vestingAddress).hex())],
      gasLimit,
      this.apiConfigService.getChainId(),
    );
  }

  async unlockToken(sender: string, token: InputToken): Promise<Transaction> {
    const contract = await this.elrondProxy.getRouterSmartContract();

    if (!AddressUtils.isAddressValid(sender)) {
      throw new BadRequestException('Provided address is not a valid bech32 address');
    }

    const gasLimit = 25000000;

    const vestingAddress = await this.stakingGetterService.getGroupIdFromLockedAssetId(
      token.identifier,
    );

    if (!vestingAddress) {
      throw new BadRequestException(`The vesting address hasn't been set yet`);
    }

    return this.contextTransactions.nftTransfer(
      new Address(sender),
      contract,
      token,
      'unlockAssets',
      [BytesValue.fromHex(Address.fromBech32(vestingAddress).hex())],
      gasLimit,
      this.apiConfigService.getChainId(),
    );
  }

  async unstake(sender: string, args: UnstakingArgs): Promise<Transaction> {
    const method = 'unstakeFarm';
    const gasLimit = 35000000;

    return await this.SftFarmInteraction(sender, args, method, gasLimit, [
      new U32Value(args.value),
    ]);
  }

  async unbond(sender: string, args: StakingArgs): Promise<Transaction> {
    const method = 'unbondFarm';
    const gasLimit = 20000000;

    return await this.SftFarmInteraction(sender, args, method, gasLimit, []);
  }

  async harvest(sender: string, args: StakingArgs): Promise<Transaction> {
    const method = 'claimRewards';
    const gasLimit = 35000000;

    return await this.SftFarmInteraction(sender, args, method, gasLimit, []);
  }

  async reinvest(sender: string, args: StakingArgs): Promise<Transaction> {
    const method = 'compoundRewards';
    const gasLimit = 35000000;

    return await this.SftFarmInteraction(sender, args, method, gasLimit, []);
  }

  private async SftFarmInteraction(
    sender: string,
    stakingArgs: TransactionArgs,
    method: string,
    gasLimit: number,
    args: TypedValue[],
  ): Promise<Transaction> {
    const contract = await this.elrondProxy.getRouterSmartContract();

    if (!AddressUtils.isAddressValid(sender)) {
      throw new BadRequestException('Provided address is not a valid bech32 address');
    }

    if (!stakingArgs.tokens || stakingArgs.tokens.length == 0) {
      throw new BadRequestException('No tokens sent');
    }

    if (stakingArgs.tokens.length > 1) {
      return this.contextTransactions.multiESDTNFTTransfer(
        new Address(sender),
        contract,
        stakingArgs.tokens,
        method,
        [],
        gasLimit,
        this.apiConfigService.getChainId(),
      );
    }

    return this.contextTransactions.nftTransfer(
      new Address(sender),
      contract,
      stakingArgs.tokens[0],
      method,
      args,
      gasLimit,
      this.apiConfigService.getChainId(),
    );
  }
}
