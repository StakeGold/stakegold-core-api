import { CachingModule, CachingModuleAsyncOptions } from '@elrondnetwork/erdnest';
import { DynamicModule } from '@nestjs/common';

export class DynamicModuleUtils {
  static getCachingModule(cachingModuleOptions: CachingModuleAsyncOptions): DynamicModule {
    return CachingModule.forRootAsync(cachingModuleOptions);
  }
}
