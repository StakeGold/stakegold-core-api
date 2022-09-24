import { CachingModuleAsyncOptions } from '@elrondnetwork/erdnest';
import { DynamicModule } from '@nestjs/common';
export declare class DynamicModuleUtils {
    static getCachingModule(cachingModuleOptions: CachingModuleAsyncOptions): DynamicModule;
}
