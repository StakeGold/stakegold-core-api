import { DynamicModule } from '@nestjs/common';
import { ElrondApiAsyncOptions, ElrondProxyAsyncOptions } from '../elrond-communication';
import { ProxyAsyncOptions } from '../proxy';
import { ApiConfigAsyncOptions } from '../api-config';
import { CachingModuleAsyncOptions } from '@elrondnetwork/erdnest';
export declare class AccountsModule {
    static forRootAsync(elrondProxyOptions: ElrondProxyAsyncOptions, proxyServiceOptions: ProxyAsyncOptions, apiConfigOptions: ApiConfigAsyncOptions, elrondApiOptions: ElrondApiAsyncOptions, cachingModuleOptions: CachingModuleAsyncOptions): DynamicModule;
}
