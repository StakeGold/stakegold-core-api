import { Interaction, ResultsParser, TypedOutcomeBundle } from '@elrondnetwork/erdjs/out';
import { Inject, Logger } from '@nestjs/common';
import { StakeGoldElrondProxyService } from '../elrond-communication';
import {
  generateRunQueryLogMessage,
  SmartContractProfiler,
  STAKEGOLD_ELROND_PROXY_SERVICE,
} from '../utils';
export class GenericAbiService {
  private readonly logger: Logger;
  private readonly resultParser: ResultsParser;

  constructor(
    @Inject(STAKEGOLD_ELROND_PROXY_SERVICE)
    private readonly elrondProxy: StakeGoldElrondProxyService,
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
        this.elrondProxy.getService(),
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
