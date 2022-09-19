import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import { SmartContractProfiler } from '../utils/smartcontract.profiler';
export interface StakeGoldElrondProxyService {
    getForwarderSmartContract(shard: number): Promise<SmartContractProfiler>;
    getService(): ProxyNetworkProvider;
    getFarmSmartContract(farmAddress: string): Promise<SmartContractProfiler>;
    getRouterSmartContract(): Promise<SmartContractProfiler>;
    getVestingSmartContract(vestingAddress: string): Promise<SmartContractProfiler>;
    getPairSmartContract(pairAddress: string): Promise<SmartContractProfiler>;
    getPairRouterSmartContract(): Promise<SmartContractProfiler>;
}
