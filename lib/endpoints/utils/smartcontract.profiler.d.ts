import { ITransactionValue, IContractFunction, IAddress, SmartContract, SmartContractAbi, TypedValue } from "@elrondnetwork/erdjs/out";
import { INetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/interface";
import { ContractQueryResponse } from "@elrondnetwork/erdjs-network-providers/out";
import { MetricsService } from "@elrondnetwork/erdnest";
export declare class SmartContractProfiler extends SmartContract {
    private readonly metricsService;
    constructor(metricsService: MetricsService, scData: {
        address: IAddress;
        abi: SmartContractAbi;
    });
    runQuery(provider: INetworkProvider, { func, args, value, caller, }: {
        func: IContractFunction;
        args?: TypedValue[];
        value?: ITransactionValue;
        caller?: IAddress;
        address: IAddress;
    }): Promise<ContractQueryResponse>;
}
