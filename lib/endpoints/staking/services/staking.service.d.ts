import { DecodeAttributesArgs } from "../../../models/staking/decoded.attrs";
import { Farm } from "../../../models/staking/Farm";
import { FarmAddress } from "../../../models/staking/farm.address";
import { StakingArgs, UnstakingArgs } from "../../../models/staking/staking.args";
import { StakingTokenAttributesModel, UnbondTokenAttributesModel } from "../../../models/staking/stakingTokenAttributes.model";
import { TransactionModel } from "../../../models/staking/transaction.model";
import { StakeGoldApiConfigService } from "../../api-config/api-config.service";
import { MetaEsdtService } from "../../meta-esdt/meta.esdt.service";
import { StakingModuleOptions } from "../options/staking.module.options";
import { StakingComputeService } from "./staking.compute.service";
import { StakingGetterService } from "./staking.getter.service";
import { TransactionsFarmService } from "./transactions-farm.service";
export declare class StakingService {
    private readonly stakingGetterService;
    private readonly stakingComputeService;
    private readonly metaEsdtService;
    private readonly apiConfigService;
    private readonly transactionService;
    private options;
    constructor(stakingGetterService: StakingGetterService, stakingComputeService: StakingComputeService, metaEsdtService: MetaEsdtService, apiConfigService: StakeGoldApiConfigService, transactionService: TransactionsFarmService, options: StakingModuleOptions);
    getFarmsOld(address?: string, vmQuery?: boolean): Promise<Farm[]>;
    getFarms(): Farm[];
    private getMetaEsdtsDetails;
    getApr(address: string): Promise<number | undefined>;
    getAnnualPercentageRewards(farmAddress: FarmAddress): Promise<{
        apr: number | undefined;
        lockedApr: number | undefined;
    }>;
    getFarmTokenSupply(farmAddress: FarmAddress): Promise<string>;
    private getFarmAddresses;
    decodeStakingTokenAttributes(args: DecodeAttributesArgs): StakingTokenAttributesModel[];
    decodeUnboundTokenAttributes(args: DecodeAttributesArgs): Promise<UnbondTokenAttributesModel[]>;
    private getUnbondigRemaingEpochs;
    stake(sender: string, args: StakingArgs): Promise<TransactionModel>;
    unstake(sender: string, args: UnstakingArgs): Promise<TransactionModel>;
    unbond(sender: string, args: StakingArgs): Promise<TransactionModel>;
    reinvest(sender: string, args: StakingArgs): Promise<TransactionModel>;
    harvest(sender: string, args: StakingArgs): Promise<TransactionModel>;
}
