import { ModuleMetadata } from "@nestjs/common";
import { StakeGoldApiConfigService } from "../api-config.service";
export interface ApiConfigAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useFactory: (...args: any[]) => Promise<StakeGoldApiConfigService> | StakeGoldApiConfigService;
    inject?: any[];
}
