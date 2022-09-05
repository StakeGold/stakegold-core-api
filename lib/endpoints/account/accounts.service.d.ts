import { CachingService } from "@elrondnetwork/erdnest";
import { AccountDetails } from "../../models/account/account.details";
import { StakeGoldElrondApiService } from "../elrond-communication/elrond-api.service";
import { StakeGoldElrondProxyService } from "../elrond-communication/elrond-proxy.service";
import { MetaEsdtService } from "../meta-esdt/meta.esdt.service";
import { AccountsModuleOptions } from "./options/account.module.options";
export declare class AccountsService {
    private readonly elrondApiService;
    private readonly elrondProxyService;
    private readonly cachingService;
    private readonly metaEsdtService;
    private options;
    constructor(elrondApiService: StakeGoldElrondApiService, elrondProxyService: StakeGoldElrondProxyService, cachingService: CachingService, metaEsdtService: MetaEsdtService, options: AccountsModuleOptions);
    getAccountDetails(address: string): Promise<AccountDetails>;
    isAddressWhitelisted(address: string): Promise<any>;
    getAddressBuys(address: string): Promise<any>;
    getStatus(address: string): Promise<any>;
}
