import { CachingModuleAsyncOptions } from 'serdnest';
import { DynamicModule } from '@nestjs/common';
export declare class DynamicModuleUtils {
    static getCachingModule(cachingModuleOptions: CachingModuleAsyncOptions): DynamicModule;
}
