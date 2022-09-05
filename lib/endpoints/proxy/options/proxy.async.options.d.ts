import { ModuleMetadata } from "@nestjs/common";
import { StakeGoldProxyService } from "../proxy.service";
export interface ProxyAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useFactory: (...args: any[]) => Promise<StakeGoldProxyService> | StakeGoldProxyService;
    inject?: any[];
}
