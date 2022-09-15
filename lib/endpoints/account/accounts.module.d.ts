import { DynamicModule } from '@nestjs/common';
import { ElrondApiAsyncOptions, ElrondProxyAsyncOptions } from '../elrond-communication';
import { ProxyAsyncOptions } from '../proxy';
import { ApiConfigAsyncOptions } from '../api-config';
export declare class AccountsModule {
    static forRootAsync(elrondProxyOptions: ElrondProxyAsyncOptions, proxyServiceOptions: ProxyAsyncOptions, apiConfigOptions: ApiConfigAsyncOptions, elrondApiOptions: ElrondApiAsyncOptions): DynamicModule;
}
