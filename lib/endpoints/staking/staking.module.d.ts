import { DynamicModule } from "@nestjs/common";
import { ApiConfigAsyncOptions } from "../api-config";
import { ElrondApiAsyncOptions, ElrondProxyAsyncOptions } from "../elrond-communication";
import { ProxyAsyncOptions } from "../proxy/options";
export declare class StakingModule {
    static forRootAsync(elrondProxyOptions: ElrondProxyAsyncOptions, proxyServiceOptions: ProxyAsyncOptions, apiConfigOptions: ApiConfigAsyncOptions, elrondApiOptions: ElrondApiAsyncOptions): DynamicModule;
}
