import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  STAKEGOLD_ELROND_API_SERVICE,
  STAKEGOLD_ELROND_PROXY_SERVICE,
  STAKEGOLD_PROXY_SERVICE,
  STAKEGOLD_API_CONFIG_SERVICE,
} from '../utils/constants';
import { AccountsService } from './accounts.service';
import { MetaEsdtModule } from '../meta-esdt/meta.esdt.module';
import { ElrondApiAsyncOptions, ElrondProxyAsyncOptions } from '../elrond-communication';
import { ProxyAsyncOptions } from '../proxy';
import { ApiConfigAsyncOptions } from '../api-config';
import { StakingModule } from '../staking';
import { CachingModuleAsyncOptions } from '@elrondnetwork/erdnest';

@Module({})
export class AccountsModule {
  static forRootAsync(
    elrondProxyOptions: ElrondProxyAsyncOptions,
    proxyServiceOptions: ProxyAsyncOptions,
    apiConfigOptions: ApiConfigAsyncOptions,
    elrondApiOptions: ElrondApiAsyncOptions,
    cachingModuleOptions: CachingModuleAsyncOptions,
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
      AccountsService,
    ];

    return {
      module: AccountsModule,
      imports: [
        StakingModule.forRootAsync(
          elrondProxyOptions,
          proxyServiceOptions,
          apiConfigOptions,
          elrondApiOptions,
          cachingModuleOptions,
        ),
        MetaEsdtModule.forRootAsync(elrondApiOptions),
      ],
      providers,
      exports: [AccountsService],
    };
  }
}
