"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const tslib_1 = require("tslib");
const erdnest_1 = require("@elrondnetwork/erdnest");
const common_1 = require("@nestjs/common");
const account_details_1 = require("../../models/account/account.details");
const AccountStatus_1 = require("../../models/account/AccountStatus");
const LockedAssetAttributes_1 = require("../../models/account/LockedAssetAttributes");
const cache_info_1 = require("../../models/caching/cache.info");
const meta_esdt_1 = require("../../models/meta-esdt/meta.esdt");
const meta_esdt_service_1 = require("../meta-esdt/meta.esdt.service");
const constants_1 = require("../utils/constants");
const account_module_options_1 = require("./options/account.module.options");
let AccountsService = class AccountsService {
    constructor(elrondApiService, elrondProxyService, cachingService, metaEsdtService, options) {
        this.elrondApiService = elrondApiService;
        this.elrondProxyService = elrondProxyService;
        this.cachingService = cachingService;
        this.metaEsdtService = metaEsdtService;
        this.options = options;
    }
    async getAccountDetails(address) {
        const egldBalance = await this.elrondApiService.getAccountBalance(address);
        const esdtTokenRequests = this.options.esdtTokens.map(async (token) => await this.elrondApiService.getEsdtToken(token, address));
        const tokens = await Promise.all(esdtTokenRequests);
        const filteredTokens = tokens.filter((token) => token);
        const metaEsdts = await this.metaEsdtService.getMetaEsdts(address, this.options.metaEsdtCollection);
        const lockedTokens = metaEsdts
            .map((token) => {
            const { unlockSchedule } = LockedAssetAttributes_1.LockedAssetAttributes.fromAttributes(token.attributes);
            return meta_esdt_1.LockedToken.fromMetaEsdt(token, unlockSchedule);
        })
            .filter((token) => token.unlockSchedule && token.balance)
            .groupBy((item) => item.collection);
        const farmTokens = await this.metaEsdtService.getMetaEsdts(address, this.options.getFarmTokensAddresses());
        return new account_details_1.AccountDetails({
            egldBalance,
            esdtTokens: filteredTokens,
            lockedTokens,
            farmTokens,
        });
    }
    async isAddressWhitelisted(address) {
        return await this.cachingService.getOrSetCache(cache_info_1.CacheInfo.WhitelistAddress(address).key, async () => {
            return await this.elrondProxyService.isAddressWhitelisted(address);
        }, cache_info_1.CacheInfo.WhitelistAddress(address).ttl);
    }
    async getAddressBuys(address) {
        return await this.elrondProxyService.getAddressBuys(address);
    }
    async getStatus(address) {
        const egldBalance = await this.elrondApiService.getAccountBalance(address);
        const balanceRequests = this.options.esdtTokens.map(async (token) => {
            return await this.elrondApiService.getAccountEsdtBalance(token, address);
        });
        const balances = await Promise.all(balanceRequests);
        const whitelisted = await this.isAddressWhitelisted(address);
        const addressBuys = await this.getAddressBuys(address);
        return new AccountStatus_1.AccountStatus({
            egldBalance,
            balances,
            addressBuys,
            whitelisted,
        });
    }
};
AccountsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.STAKEGOLD_ELROND_API_SERVICE)),
    tslib_1.__param(1, (0, common_1.Inject)(constants_1.STAKEGOLD_ELROND_PROXY_SERVICE)),
    tslib_1.__param(4, (0, common_1.Inject)(constants_1.ACCOUNT_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object, Object, erdnest_1.CachingService,
        meta_esdt_service_1.MetaEsdtService,
        account_module_options_1.AccountsModuleOptions])
], AccountsService);
exports.AccountsService = AccountsService;
//# sourceMappingURL=accounts.service.js.map