import { EsdtToken } from "../../models/account/esdtToken.model";
import { MetaEsdtDetailed } from "../../models/meta-esdt/meta.esdt";
export interface StakeGoldElrondApiService {
    getAccountBalance(address: string): Promise<string>;
    getEsdtTokenDetails(token: string, address: string): Promise<EsdtToken | undefined>;
    getMetaEsdts(address: string, collections?: string[]): Promise<MetaEsdtDetailed[]>;
    getAccountEsdtBalance(token: string, address: string): Promise<string>;
    getCurrentBlockNonce(shardId: number): Promise<number>;
}
