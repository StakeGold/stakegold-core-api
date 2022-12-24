import { Inject, Injectable } from '@nestjs/common';
import { AccountDetails } from 'src/models/account/account.details.model';
import { FarmStakingGroupContract } from 'src/models/staking/farm.staking.contract';
import { EsdtToken } from '../../models/account/esdtToken.model';
import { LockedAssetAttributes } from '../../models/account/LockedAssetAttributes';
import {
  LockedToken,
  LockedTokenCollection,
  MetaEsdtDetailed,
} from '../../models/meta-esdt/meta.esdt';
import { StakeGoldElrondApiService } from '../elrond-communication/elrond-api.service';
import { MetaEsdtService } from '../meta-esdt/meta.esdt.service';
import { StakingGetterService } from '../staking';
import { STAKEGOLD_ELROND_API_SERVICE } from '../utils/constants';
import { calcUnlockDateText } from '../utils';

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

  async getStakingEsdtTokens(esdtTokens: EsdtToken[]): Promise<EsdtToken[]> {
    console.time('farmStakingGroups');
    const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();
    console.timeEnd('farmStakingGroups');

    const tokenIds = (await Promise.all(
      farmStakingGroups
        .map(async (group) => {
          const groupRewardTokenId =
            await this.stakingGetterService.getRewardTokenIdByGroupIdentifier(group.groupId);

          const ids = group.childContracts
            .map((childContract) => [childContract.farmingTokenId, childContract.rewardTokenId])
            .flat();

          if (!ids.includes(groupRewardTokenId)) {
            ids.push(groupRewardTokenId);
          }

          return ids;
        })
        .flat(),
    )
      .then((arr) => arr.flat())
      .catch(() => [])) as string[];

    const uniqueLockedTokenIds = [...new Set(tokenIds.map((id) => id))];

    const result = esdtTokens.filter((token) => uniqueLockedTokenIds.includes(token.identifier));
    return result;
  }

  async getLockedTokens(address: string): Promise<LockedTokenCollection[]> {
    const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();

    const uniqueLockedTokenIds = await this.getLockedTokenUniqueIds(farmStakingGroups);
    if (uniqueLockedTokenIds.length === 0) {
      return [];
    }

    const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, uniqueLockedTokenIds);

    const lockedTokensMap: Map<string, LockedTokenCollection> = new Map();

    for (const token of metaEsdts) {
      const { unlockSchedule } = LockedAssetAttributes.fromAttributes(token.attributes);
      if (!unlockSchedule || !token.balance) {
        continue;
      }

      const currentStats = await this.stakingGetterService.getStats();

      unlockSchedule?.map((milestone) => {
        const remainingEpochs = milestone.epoch ? milestone.epoch - currentStats.epoch : 0;

        const { unlocksAtDate, unlocksAtText } = calcUnlockDateText({
          epochs: remainingEpochs,
          stats: currentStats,
          hasSteps: false,
        });

        milestone.unlockDate = `${unlocksAtText} ${unlocksAtDate}`?.trim();
      });

      const lockedTokenCollection =
        lockedTokensMap.get(token.collection) ??
        ({ collection: token.collection, tokens: [] } as LockedTokenCollection);

      lockedTokenCollection.tokens.push({
        ticker: token.ticker,
        collection: token.collection,
        identifier: token.identifier,
        name: token.name,
        nonce: token.nonce,
        balance: token.balance,
        decimals: token.decimals,
        assets: token.assets,
        unlockSchedule,
      } as LockedToken);

      lockedTokensMap.set(token.collection, lockedTokenCollection);
    }
    return Array.from(lockedTokensMap.values());
  }

  private async getLockedTokenUniqueIds(farmStakingGroups: FarmStakingGroupContract[]) {
    const lockedTokenIds = await Promise.all(
      farmStakingGroups
        .map(async (group) => {
          try {
            const lockedAssetTokenId = await this.stakingGetterService.getLockedAssetTokenId(
              group.groupId,
            );
            return lockedAssetTokenId;
          } catch {
            return undefined;
          }
        })
        .flat(),
    );

    const uniqueLockedTokenIds = [
      ...new Set(lockedTokenIds.map((id) => id).filter((id) => id) as string[]),
    ];
    return uniqueLockedTokenIds;
  }

  async getFarmTokens(address: string): Promise<MetaEsdtDetailed[]> {
    const uniqueFarmTokenIds = await this.getFarmTokenIds();
    if (uniqueFarmTokenIds.length === 0) {
      return [];
    }

    const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, uniqueFarmTokenIds);

    return metaEsdts;
  }

  async getFarmTokenIds(): Promise<string[]> {
    const farmStakingGroups = await this.stakingGetterService.getFarmStakingGroups();

    const farmTokenIds = farmStakingGroups
      .map((group) => group.childContracts.map((childContract) => childContract.farmTokenId))
      .flat()
      .distinct();

    return farmTokenIds;
  }
}
