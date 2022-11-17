import { Injectable, Logger } from '@nestjs/common';
import { CachingService, ContextTracker } from 'serdnest';
import { generateGetLogMessage } from '../utils';
@Injectable()
export class GenericGetterService {
  private readonly logger: Logger;

  constructor(
    protected readonly cachingService: CachingService,
    protected readonly serviceName: string,
  ) {
    this.logger = new Logger(serviceName);
  }

  protected async getData(cacheKey: string, createValueFunc: () => any, ttl: number): Promise<any> {
    try {
      const noCache = ContextTracker.get()?.noCache ?? false;
      if (noCache) {
        ContextTracker.assign({ noCache: false });
        const funcValue = await createValueFunc();
        if (funcValue) {
          await this.cachingService.setCache(cacheKey, funcValue, ttl);
          return funcValue;
        }
        return undefined;
      }
      return await this.cachingService.getOrSetCache(cacheKey, createValueFunc, ttl);
    } catch (error: any) {
      const logMessage = generateGetLogMessage(
        this.constructor.name,
        createValueFunc.name,
        cacheKey,
        error.message,
      );
      this.logger.error(logMessage);
      throw error;
    }
  }
}
