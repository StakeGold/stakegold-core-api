import { ModuleMetadata } from "@nestjs/common";
import { AccountsModuleOptions } from "./account.module.options";

export interface AccountModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory: (
    ...args: any[]
  ) => Promise<AccountsModuleOptions> | AccountsModuleOptions;
  inject?: any[];
}
