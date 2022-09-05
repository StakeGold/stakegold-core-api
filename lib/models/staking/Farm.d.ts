import BigNumber from "bignumber.js";
import { MetaEsdtDetailed } from "../meta-esdt/meta.esdt";
import { FarmAddress } from "./farm.address";
import { StakeTokenModel } from "./stake.token.model";
export declare class Farm {
    addresses: FarmAddress;
    farmingToken: StakeTokenModel;
    farmTotalSupply: BigNumber;
    apr?: number;
    lockedApr?: number;
    accumulatedRewards: BigNumber;
    accumulatedStakings: BigNumber;
    positions: Position[];
    constructor(init?: Partial<Farm>);
}
export declare class Position {
    farmToken: MetaEsdtDetailed;
    rewardToken: StakeTokenModel;
    constructor(farmToken: MetaEsdtDetailed, rewardToken: StakeTokenModel);
}
