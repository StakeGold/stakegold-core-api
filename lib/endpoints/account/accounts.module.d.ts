import { DynamicModule } from "@nestjs/common";
import { AccountModuleAsyncOptions } from "./options/account.module.async.options";
import { ElrondApiAsyncOptions, ElrondProxyAsyncOptions } from "../elrond-communication";
export declare class AccountsModule {
    static forRootAsync(options: AccountModuleAsyncOptions, elrondApiOptions: ElrondApiAsyncOptions, elrondProxyOptions: ElrondProxyAsyncOptions): DynamicModule;
}
