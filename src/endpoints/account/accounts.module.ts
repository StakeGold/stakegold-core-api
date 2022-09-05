import { DynamicModule, Module, Provider } from "@nestjs/common";
import {
  ACCOUNT_OPTIONS, STAKEGOLD_ELROND_API_SERVICE, STAKEGOLD_ELROND_PROXY_SERVICE,
} from "../utils/constants";
import { AccountModuleAsyncOptions } from "./options/account.module.async.options";
import { AccountsService } from "./accounts.service";
import { MetaEsdtModule } from "../meta-esdt/meta.esdt.module";
import { ElrondApiAsyncOptions, ElrondProxyAsyncOptions } from "../elrond-communication";

@Module({})
export class AccountsModule {
  static forRootAsync(
    options: AccountModuleAsyncOptions,
    elrondApiOptions: ElrondApiAsyncOptions,
    elrondProxyOptions: ElrondProxyAsyncOptions,
  ): DynamicModule {
    const providers: Provider[] = [
      {
        provide: ACCOUNT_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject,
      },
      {
        provide: STAKEGOLD_ELROND_API_SERVICE,
        useFactory: elrondApiOptions.useFactory,
        inject: elrondApiOptions.inject,
      },
      {
        provide: STAKEGOLD_ELROND_PROXY_SERVICE,
        useFactory: elrondProxyOptions.useFactory,
        inject: elrondProxyOptions.inject,
      },
      AccountsService,
    ];

    return {
      module: AccountsModule,
      imports: [MetaEsdtModule.forRootAsync(elrondApiOptions)],
      providers,
      exports: [AccountsService],
    };
  }
}
