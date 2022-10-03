import { CachingModule, CachingModuleAsyncOptions } from 'serdnest';
import { DynamicModule } from '@nestjs/common';

export class DynamicModuleUtils {
  static getCachingModule(cachingModuleOptions: CachingModuleAsyncOptions): DynamicModule {
    return CachingModule.forRootAsync(cachingModuleOptions);
  }
}
