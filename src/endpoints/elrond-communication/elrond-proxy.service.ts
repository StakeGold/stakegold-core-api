import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import BigNumber from "bignumber.js";
import { SmartContractProfiler } from "../utils/smartcontract.profiler";

export interface StakeGoldElrondProxyService {
  getForwarderSmartContract(shard: number): Promise<SmartContractProfiler>;

  getService(): ProxyNetworkProvider;

  getFarmSmartContract(farmAddress: string): Promise<SmartContractProfiler>;

  getRouterSmartContract(): Promise<SmartContractProfiler>;

  getVestingSmartContract(vestingAddress: string): Promise<SmartContractProfiler>;

  isAddressWhitelisted(address: string): Promise<boolean>;

  getAddressBuys(address: string): Promise<BigNumber>;
}
