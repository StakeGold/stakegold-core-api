import { CachingService } from '@elrondnetwork/erdnest';
import { Inject, Injectable } from '@nestjs/common';
import { AccountDetails } from '../../models/account/account.details';
import { AccountStatus } from '../../models/account/AccountStatus';
import { EsdtToken } from '../../models/account/esdtToken.model';
import { LockedAssetAttributes } from '../../models/account/LockedAssetAttributes';
import { CacheInfo } from '../../models/caching/cache.info';
import { LockedToken } from '../../models/meta-esdt/meta.esdt';
import { StakeGoldElrondApiService } from '../elrond-communication/elrond-api.service';
import { StakeGoldElrondProxyService } from '../elrond-communication/elrond-proxy.service';
import { MetaEsdtService } from '../meta-esdt/meta.esdt.service';
import {
  ACCOUNT_OPTIONS,
  STAKEGOLD_ELROND_API_SERVICE,
  STAKEGOLD_ELROND_PROXY_SERVICE,
} from '../utils/constants';
import { AccountsModuleOptions } from './options/account.module.options';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(STAKEGOLD_ELROND_API_SERVICE)
    private readonly elrondApiService: StakeGoldElrondApiService,
    @Inject(STAKEGOLD_ELROND_PROXY_SERVICE)
    private readonly elrondProxyService: StakeGoldElrondProxyService,
    private readonly cachingService: CachingService,
    private readonly metaEsdtService: MetaEsdtService,
    @Inject(ACCOUNT_OPTIONS) private options: AccountsModuleOptions,
  ) {}

  async getAccountDetails(address: string): Promise<AccountDetails> {
    const egldBalance = await this.elrondApiService.getAccountBalance(address);

    const esdtTokenRequests = this.options.esdtTokens.map(
      async (token) => await this.elrondApiService.getEsdtToken(token, address),
    );
    const tokens = await Promise.all(esdtTokenRequests);
    const filteredTokens = tokens.filter((token) => token) as EsdtToken[];

    const metaEsdts = await this.metaEsdtService.getMetaEsdts(
      address,
      this.options.metaEsdtCollection,
    );

    const lockedTokens = metaEsdts
      .map((token) => {
        const { unlockSchedule } = LockedAssetAttributes.fromAttributes(token.attributes);
        return LockedToken.fromMetaEsdt(token, unlockSchedule);
      })
      .filter((token) => token.unlockSchedule && token.balance)
      .groupBy((item) => item.collection) as Map<string, LockedToken[]>;

    const farmTokens = await this.metaEsdtService.getMetaEsdts(
      address,
      this.options.getFarmTokensAddresses(),
    );

    return new AccountDetails({
      egldBalance,
      esdtTokens: filteredTokens,
      lockedTokens,
      farmTokens,
    });
  }

  async isAddressWhitelisted(address: string): Promise<any> {
    return await this.cachingService.getOrSetCache(
      CacheInfo.WhitelistAddress(address).key,
      async () => {
        return await this.elrondProxyService.isAddressWhitelisted(address);
      },
      CacheInfo.WhitelistAddress(address).ttl,
    );
  }

  async getAddressBuys(address: string): Promise<any> {
    return await this.elrondProxyService.getAddressBuys(address);
  }

  async getStatus(address: string): Promise<any> {
    const egldBalance = await this.elrondApiService.getAccountBalance(address);
    const balanceRequests = this.options.esdtTokens.map(async (token) => {
      return await this.elrondApiService.getAccountEsdtBalance(token, address);
    });

    const balances = await Promise.all(balanceRequests);

    const whitelisted = await this.isAddressWhitelisted(address);
    const addressBuys = await this.getAddressBuys(address);
    return new AccountStatus({
      egldBalance,
      balances,
      addressBuys,
      whitelisted,
    });
  }
}
