import { MetaEsdtDetailed } from '../../models/meta-esdt/meta.esdt';
import { StakeGoldElrondApiService } from '../elrond-communication/elrond-api.service';
export declare class MetaEsdtService {
    private readonly elrondApiService;
    constructor(elrondApiService: StakeGoldElrondApiService);
    getMetaEsdts(address: string, collections?: string[]): Promise<MetaEsdtDetailed[]>;
}
