import { Inject, Injectable } from '@nestjs/common';
import { MetaEsdtDetailed } from '../../models/meta-esdt/meta.esdt';
import { StakeGoldElrondApiService } from '../elrond-communication/elrond-api.service';
import { STAKEGOLD_ELROND_API_SERVICE } from '../utils/constants';

@Injectable()
export class MetaEsdtService {
  constructor(
    @Inject(STAKEGOLD_ELROND_API_SERVICE)
    private readonly elrondApiService: StakeGoldElrondApiService,
  ) {}

  async getMetaEsdts(address: string, collections?: string[]): Promise<MetaEsdtDetailed[]> {
    return (await this.elrondApiService.getMetaEsdts(address, collections)) ?? [];
  }
}
