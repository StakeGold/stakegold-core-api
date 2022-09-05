import { DynamicModule } from "@nestjs/common";
import { ApiConfigAsyncOptions } from "../api-config";
import { ElrondApiAsyncOptions, ElrondProxyAsyncOptions } from "../elrond-communication";
import { ProxyAsyncOptions } from "../proxy/options";
import { StakingModuleAsyncOptions } from "./options/staking.module.async.options";
export declare class StakingModule {
    static forRootAsync(stakingModuleOptions: StakingModuleAsyncOptions, elrondProxyOptions: ElrondProxyAsyncOptions, proxyServiceOptions: ProxyAsyncOptions, apiConfigOptions: ApiConfigAsyncOptions, elrondApiOptions: ElrondApiAsyncOptions): DynamicModule;
}
