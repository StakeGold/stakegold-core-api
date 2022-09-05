import { ModuleMetadata } from "@nestjs/common";
import { StakeGoldElrondProxyService } from "../elrond-proxy.service";
export interface ElrondProxyAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useFactory: (...args: any[]) => Promise<StakeGoldElrondProxyService> | StakeGoldElrondProxyService;
    inject?: any[];
}
