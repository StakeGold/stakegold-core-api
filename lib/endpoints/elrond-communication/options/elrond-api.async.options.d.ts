import { ModuleMetadata } from "@nestjs/common";
import { StakeGoldElrondApiService } from "../elrond-api.service";
export interface ElrondApiAsyncOptions extends Pick<ModuleMetadata, "imports"> {
    useFactory: (...args: any[]) => Promise<StakeGoldElrondApiService> | StakeGoldElrondApiService;
    inject?: any[];
}
