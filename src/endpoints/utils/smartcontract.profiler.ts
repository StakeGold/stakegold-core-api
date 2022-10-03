import {
  ITransactionValue,
  IContractFunction,
  IAddress,
  SmartContract,
  SmartContractAbi,
  TypedValue,
} from '@elrondnetwork/erdjs/out';
import { Injectable } from '@nestjs/common';
import { INetworkProvider } from '@elrondnetwork/erdjs-network-providers/out/interface';
import { ContractQueryResponse } from '@elrondnetwork/erdjs-network-providers/out';
import { PerformanceProfiler } from './performance.profiler';
import { MetricsService } from 'serdnest';

@Injectable()
export class SmartContractProfiler extends SmartContract {
  constructor(
    private readonly metricsService: MetricsService,
    scData: { address: IAddress; abi: SmartContractAbi },
  ) {
    super(scData);
  }

  async runQuery(
    provider: INetworkProvider,
    {
      func,
      args,
      value,
      caller,
    }: {
      func: IContractFunction;
      args?: TypedValue[];
      value?: ITransactionValue;
      caller?: IAddress;
      address: IAddress;
    },
  ): Promise<ContractQueryResponse> {
    const profiler = new PerformanceProfiler();

    const query = super.createQuery({
      func,
      args,
      value,
      caller,
    });

    const queryResponse = await provider.queryContract(query);

    profiler.stop();

    this.metricsService.setExternalCall(func.name, profiler.duration);

    // TODO remove when we have grafana
    //this.cachingService.setExternalCall().then().catch();

    return queryResponse;
  }
}
