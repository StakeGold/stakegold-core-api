import { Inject, Injectable } from '@nestjs/common';
import { AccountDetails } from 'src/models/account/account.details.model';
import { EsdtToken } from '../../models/account/esdtToken.model';
import { LockedAssetAttributes } from '../../models/account/LockedAssetAttributes';
import { LockedToken, MetaEsdtDetailed } from '../../models/meta-esdt/meta.esdt';
import { StakeGoldElrondApiService } from '../elrond-communication/elrond-api.service';
import { MetaEsdtService } from '../meta-esdt/meta.esdt.service';
import { StakingGetterService } from '../staking';
import { STAKEGOLD_ELROND_API_SERVICE } from '../utils/constants';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(STAKEGOLD_ELROND_API_SERVICE)
    private readonly elrondApiService: StakeGoldElrondApiService,
    private readonly metaEsdtService: MetaEsdtService,
    private readonly stakingGetterService: StakingGetterService,
  ) {}

  async getAccountDetails(address: string) {
    const egldBalance = await this.getEgldBalance(address);
    return { address, egldBalance } as AccountDetails;
  }

  async getEgldBalance(address: string): Promise<string> {
    return await this.elrondApiService.getAccountBalance(address);
  }

  async getEsdtTokens(address: string): Promise<EsdtToken[]> {
    return this.elrondApiService.getEsdtTokens(address);
  }

  async getLockedTokens(address: string): Promise<LockedToken[]> {
    const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();

    const lockedTokenIds = farmStakingGroups
      .map((group) =>
        group.childContracts
          .map((childContract) => [childContract.farmTokenId, childContract.rewardTokenId])
          .flat(),
      )
      .flat();
    const uniqueLockedTokenIds = [...new Set(lockedTokenIds.map((id) => id))];

    const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, uniqueLockedTokenIds);

    const lockedTokens = metaEsdts
      .map((token) => {
        const { unlockSchedule } = LockedAssetAttributes.fromAttributes(token.attributes);
        return {
          ticker: token.ticker,
          collection: token.collection,
          identifier: token.identifier,
          name: token.name,
          nonce: token.nonce,
          balance: token.balance,
          decimals: token.decimals,
          assets: token.assets,
          unlockSchedule,
        } as LockedToken;
      })
      .filter((token) => token.unlockSchedule && token.balance);

    return lockedTokens;
  }

  async getFarmTokens(address: string): Promise<MetaEsdtDetailed[]> {
    const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();

    const farmTokenIds = farmStakingGroups
      .map((group) => group.childContracts.map((childContract) => childContract.farmTokenId))
      .flat();

    const uniqueFarmTokenIds = [...new Set(farmTokenIds.map((id) => id))];

    const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, uniqueFarmTokenIds);

    return metaEsdts;
  }
}
