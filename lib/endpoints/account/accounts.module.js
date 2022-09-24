"use strict";
var AccountsModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const constants_1 = require("../utils/constants");
const accounts_service_1 = require("./accounts.service");
const meta_esdt_module_1 = require("../meta-esdt/meta.esdt.module");
const staking_1 = require("../staking");
let AccountsModule = AccountsModule_1 = class AccountsModule {
    static forRootAsync(elrondProxyOptions, proxyServiceOptions, apiConfigOptions, elrondApiOptions, cachingModuleOptions) {
        const providers = [
            {
                provide: constants_1.STAKEGOLD_ELROND_PROXY_SERVICE,
                useFactory: elrondProxyOptions.useFactory,
                inject: elrondProxyOptions.inject,
            },
            {
                provide: constants_1.STAKEGOLD_PROXY_SERVICE,
                useFactory: proxyServiceOptions.useFactory,
                inject: proxyServiceOptions.inject,
            },
            {
                provide: constants_1.STAKEGOLD_API_CONFIG_SERVICE,
                useFactory: apiConfigOptions.useFactory,
                inject: apiConfigOptions.inject,
            },
            {
                provide: constants_1.STAKEGOLD_ELROND_API_SERVICE,
                useFactory: elrondApiOptions.useFactory,
                inject: elrondApiOptions.inject,
            },
            accounts_service_1.AccountsService,
        ];
        return {
            module: AccountsModule_1,
            imports: [
                staking_1.StakingModule.forRootAsync(elrondProxyOptions, proxyServiceOptions, apiConfigOptions, elrondApiOptions, cachingModuleOptions),
                meta_esdt_module_1.MetaEsdtModule.forRootAsync(elrondApiOptions),
            ],
            providers,
            exports: [accounts_service_1.AccountsService],
        };
    }
};
AccountsModule = AccountsModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], AccountsModule);
exports.AccountsModule = AccountsModule;
//# sourceMappingURL=accounts.module.js.map