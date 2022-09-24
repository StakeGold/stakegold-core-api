"use strict";
var StakingModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const context_transactions_service_1 = require("../context/context.transactions.service");
const meta_esdt_module_1 = require("../meta-esdt/meta.esdt.module");
const constants_1 = require("../utils/constants");
const dynamic_module_utils_1 = require("../utils/dynamic.module.utils");
const staking_abi_service_1 = require("./services/staking.abi.service");
const staking_compute_service_1 = require("./services/staking.compute.service");
const staking_getter_service_1 = require("./services/staking.getter.service");
const staking_service_1 = require("./services/staking.service");
const transactions_farm_service_1 = require("./services/transactions-farm.service");
let StakingModule = StakingModule_1 = class StakingModule {
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
            staking_abi_service_1.AbiStakingService,
            staking_service_1.StakingService,
            staking_getter_service_1.StakingGetterService,
            staking_compute_service_1.StakingComputeService,
            transactions_farm_service_1.TransactionsFarmService,
            context_transactions_service_1.ContextTransactionsService,
        ];
        return {
            module: StakingModule_1,
            imports: [
                meta_esdt_module_1.MetaEsdtModule.forRootAsync(elrondApiOptions),
                dynamic_module_utils_1.DynamicModuleUtils.getCachingModule(cachingModuleOptions),
            ],
            providers,
            exports: [
                staking_service_1.StakingService,
                staking_getter_service_1.StakingGetterService,
                staking_compute_service_1.StakingComputeService,
                transactions_farm_service_1.TransactionsFarmService,
                context_transactions_service_1.ContextTransactionsService,
            ],
        };
    }
};
StakingModule = StakingModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], StakingModule);
exports.StakingModule = StakingModule;
//# sourceMappingURL=staking.module.js.map