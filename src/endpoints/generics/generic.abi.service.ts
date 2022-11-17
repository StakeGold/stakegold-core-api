import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import { Interaction, ResultsParser, TypedOutcomeBundle } from '@elrondnetwork/erdjs/out';
import { Injectable, Logger } from '@nestjs/common';
import { generateRunQueryLogMessage, SmartContractProfiler } from '../utils';
@Injectable()
export class GenericAbiService {
  private readonly logger: Logger;
  private readonly resultParser: ResultsParser;

  constructor(
    protected readonly proxyNetworkProvider: ProxyNetworkProvider,
    protected readonly serviceName: string,
  ) {
    this.logger = new Logger(serviceName);
    this.resultParser = new ResultsParser();
  }

  async getGenericData(
    contract: SmartContractProfiler,
    interaction: Interaction,
  ): Promise<TypedOutcomeBundle> {
    try {
      const queryResponse = await contract.runQuery(
        this.proxyNetworkProvider,
        interaction.buildQuery(),
      );
      return this.resultParser.parseQueryResponse(queryResponse, interaction.getEndpoint());
    } catch (error: any) {
      const logMessage = generateRunQueryLogMessage(
        this.serviceName,
        interaction.getEndpoint().name,
        error.message,
      );
      this.logger.error(logMessage);

      throw error;
    }
  }
}
