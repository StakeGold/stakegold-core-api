import { DynamicModule } from "@nestjs/common";
import { ElrondApiAsyncOptions } from "../elrond-communication";
export declare class MetaEsdtModule {
    static forRootAsync(elrondApiOptions: ElrondApiAsyncOptions): DynamicModule;
}
