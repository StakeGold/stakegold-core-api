import { ElrondCachingModule, RedisCacheModuleAsyncOptions } from '@elrondnetwork/erdnest';
import { DynamicModule } from '@nestjs/common';

export class DynamicModuleUtils {
  static getCachingModule(cachingModuleOptions: RedisCacheModuleAsyncOptions): DynamicModule {
    return ElrondCachingModule.forRootAsync(cachingModuleOptions);
  }
}
