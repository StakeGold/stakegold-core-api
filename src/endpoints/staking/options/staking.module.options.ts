import { FarmInfo } from "src/models/staking/farm.info";

export class StakingModuleOptions {
  farmsInfo: FarmInfo[] = [];

  constructor(farmsInfo: FarmInfo[]) {
    this.farmsInfo = farmsInfo;
  }
}
