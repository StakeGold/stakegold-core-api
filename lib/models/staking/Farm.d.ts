import { MetaEsdtDetailed } from "../meta-esdt/meta.esdt";
import { FarmAddress } from "./farm.address";
import { StakeTokenModel } from "./stake.token.model";
export interface Farm {
    farmAddress: FarmAddress;
    address: string;
    vmQuery: boolean;
    farmingToken: StakeTokenModel;
    farmTotalSupply: string;
    apr?: number;
    lockedApr?: number;
    accumulatedRewards: string;
    accumulatedStakings: string;
    positions: Position[];
}
export interface Position {
    farmToken: MetaEsdtDetailed;
    rewardToken: StakeTokenModel;
}
