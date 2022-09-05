import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ElrondApiAsyncOptions } from "../elrond-communication";
import { STAKEGOLD_ELROND_API_SERVICE } from "../utils/constants";
import { MetaEsdtService } from "./meta.esdt.service";

@Module({})
export class MetaEsdtModule {
  static forRootAsync(
    elrondApiOptions: ElrondApiAsyncOptions
  ): DynamicModule {
    const providers: Provider[] = [
      {
        provide: STAKEGOLD_ELROND_API_SERVICE,
        useFactory: elrondApiOptions.useFactory,
        inject: elrondApiOptions.inject,
      },
      MetaEsdtService,
    ];

    return {
      module: MetaEsdtModule,
      imports: [],
      providers,
      exports: [MetaEsdtService],
    };
  }
}
