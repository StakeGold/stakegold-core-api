import { AccountDetails } from 'src/models/account/account.details.model';
import { EsdtToken } from '../../models/account/esdtToken.model';
import { LockedTokenCollection, MetaEsdtDetailed } from '../../models/meta-esdt/meta.esdt';
import { StakeGoldElrondApiService } from '../elrond-communication/elrond-api.service';
import { MetaEsdtService } from '../meta-esdt/meta.esdt.service';
import { StakingGetterService } from '../staking';
export declare class AccountsService {
    private readonly elrondApiService;
    private readonly metaEsdtService;
    private readonly stakingGetterService;
    constructor(elrondApiService: StakeGoldElrondApiService, metaEsdtService: MetaEsdtService, stakingGetterService: StakingGetterService);
    getAccountDetails(address: string): Promise<AccountDetails>;
    getEgldBalance(address: string): Promise<string>;
    getEsdtTokens(address: string): Promise<EsdtToken[]>;
    getLockedTokens(address: string): Promise<LockedTokenCollection[]>;
    private getLockedTokenUniqueIds;
    getFarmTokens(address: string): Promise<MetaEsdtDetailed[]>;
    getFarmTokenIds(): Promise<string[]>;
}
