import { Injectable, Logger } from '@nestjs/common';
import { CachingService } from 'serdnest';
import { generateLogMessage } from '../utils';

@Injectable()
export class GenericSetterService {
  private readonly logger: Logger;

  constructor(
    protected readonly cachingService: CachingService,
    protected readonly serviceName: string,
  ) {
    this.logger = new Logger(serviceName);
  }

  protected async setData(cacheKey: string, value: any, ttl: number): Promise<string> {
    try {
      await this.cachingService.setCache(cacheKey, value, ttl);
      return cacheKey;
    } catch (error: any) {
      const logMessage = generateLogMessage(
        this.constructor.name,
        this.setData.name,
        cacheKey,
        error.message,
      );
      this.logger.error(logMessage);
      throw error;
    }
  }
}
