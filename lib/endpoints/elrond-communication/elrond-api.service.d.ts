import { NftCollection } from 'src/models';
import { EsdtToken } from '../../models/account/esdtToken.model';
import { MetaEsdtDetailed } from '../../models/meta-esdt/meta.esdt';
export interface StakeGoldElrondApiService {
    getAccountBalance(address: string): Promise<string>;
    getEsdtToken(token: string, address?: string): Promise<EsdtToken | undefined>;
    getEsdtTokens(address?: string): Promise<EsdtToken[]>;
    getMetaEsdts(address: string, collections?: string[]): Promise<MetaEsdtDetailed[]>;
    getCurrentBlockNonce(shardId: number): Promise<number>;
    getNftCollection(identifier: string): Promise<NftCollection | undefined>;
}
