import BigNumber from "bignumber.js";
import { MetaEsdtDetailed } from "../meta-esdt/meta.esdt";
import { FarmAddress } from "./farm.address";
import { StakeTokenModel } from "./stake.token.model";

export class Farm {
  addresses: FarmAddress = new FarmAddress();
  farmingToken: StakeTokenModel = new StakeTokenModel();
  farmTotalSupply: BigNumber = new BigNumber(0);
  apr?: number = 0;
  lockedApr?: number = 0;
  accumulatedRewards: BigNumber = new BigNumber(0);
  accumulatedStakings: BigNumber = new BigNumber(0);
  positions: Position[] = [];

  constructor(init?: Partial<Farm>) {
    Object.assign(this, init);
  }
}

export class Position {
  farmToken: MetaEsdtDetailed;
  rewardToken: StakeTokenModel;

  constructor(farmToken: MetaEsdtDetailed, rewardToken: StakeTokenModel) {
    this.farmToken = farmToken;
    this.rewardToken = rewardToken;
  }
}
