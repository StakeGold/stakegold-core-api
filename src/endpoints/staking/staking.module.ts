import { DynamicModule, forwardRef, Module, Provider } from "@nestjs/common";
import { ApiConfigAsyncOptions } from "../api-config";
import { ContextTransactionsService } from "../context/context.transactions.service";
import { ElrondApiAsyncOptions, ElrondProxyAsyncOptions } from "../elrond-communication";
import { MetaEsdtModule } from "../meta-esdt/meta.esdt.module";
import { ProxyAsyncOptions } from "../proxy/options";
import {
  STAKEGOLD_API_CONFIG_SERVICE,
  STAKEGOLD_ELROND_API_SERVICE,
  STAKEGOLD_ELROND_PROXY_SERVICE,
  STAKEGOLD_PROXY_SERVICE,
} from "../utils/constants";
import { AbiStakingService } from "./services/staking.abi.service";
import { StakingComputeService } from "./services/staking.compute.service";
import { StakingGetterService } from "./services/staking.getter.service";
import { StakingService } from "./services/staking.service";
import { TransactionsFarmService } from "./services/transactions-farm.service";

@Module({
  imports: [forwardRef(() => MetaEsdtModule)],
  providers: [
    AbiStakingService,
    StakingService,
    StakingGetterService,
    StakingComputeService,
    TransactionsFarmService,
    ContextTransactionsService,
  ],
  exports: [StakingService],
})
export class StakingModule {
  static forRootAsync(
    elrondProxyOptions: ElrondProxyAsyncOptions,
    proxyServiceOptions: ProxyAsyncOptions,
    apiConfigOptions: ApiConfigAsyncOptions,
    elrondApiOptions: ElrondApiAsyncOptions
  ): DynamicModule {
    const providers: Provider[] = [
      {
        provide: STAKEGOLD_ELROND_PROXY_SERVICE,
        useFactory: elrondProxyOptions.useFactory,
        inject: elrondProxyOptions.inject,
      },
      {
        provide: STAKEGOLD_PROXY_SERVICE,
        useFactory: proxyServiceOptions.useFactory,
        inject: proxyServiceOptions.inject,
      },
      {
        provide: STAKEGOLD_API_CONFIG_SERVICE,
        useFactory: apiConfigOptions.useFactory,
        inject: apiConfigOptions.inject,
      },
      {
        provide: STAKEGOLD_ELROND_API_SERVICE,
        useFactory: elrondApiOptions.useFactory,
        inject: elrondApiOptions.inject,
      },
      AbiStakingService,
      StakingService,
      StakingGetterService,
      StakingComputeService,
      TransactionsFarmService,
      ContextTransactionsService,
    ];

    return {
      module: StakingModule,
      imports: [MetaEsdtModule.forRootAsync(elrondApiOptions)],
      providers,
      exports: [
        StakingService,
        StakingGetterService,
        StakingComputeService,
        TransactionsFarmService,
        ContextTransactionsService,
      ],
    };
  }
}
