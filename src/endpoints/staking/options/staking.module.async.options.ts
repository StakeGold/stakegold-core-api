import { ModuleMetadata } from "@nestjs/common";
import { StakingModuleOptions } from "./staking.module.options";

export interface StakingModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory: (
    ...args: any[]
  ) => Promise<StakingModuleOptions> | StakingModuleOptions;
  inject?: any[];
}
