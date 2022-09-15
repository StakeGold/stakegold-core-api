import { FarmAddresses } from 'src/models';
import { DecodeAttributesArgs } from '../../../models/staking/decoded.attrs';
import { Farm } from '../../../models/staking/Farm';
import { StakeFarmToken } from '../../../models/staking/stakeFarmToken.model';
import { StakingArgs, UnstakingArgs } from '../../../models/staking/staking.args';
import { StakingTokenAttributesModel, UnbondTokenAttributesModel } from '../../../models/staking/stakingTokenAttributes.model';
import { Transaction } from '../../../models/staking/transaction.model';
import { UnbondFarmToken } from '../../../models/staking/unbondFarmToken.model';
import { MetaEsdtService } from '../../meta-esdt/meta.esdt.service';
import { StakingComputeService } from './staking.compute.service';
import { StakingGetterService } from './staking.getter.service';
import { TransactionsFarmService } from './transactions-farm.service';
export declare class StakingService {
    private readonly stakingGetterService;
    private readonly stakingComputeService;
    private readonly metaEsdtService;
    private readonly transactionService;
    constructor(stakingGetterService: StakingGetterService, stakingComputeService: StakingComputeService, metaEsdtService: MetaEsdtService, transactionService: TransactionsFarmService);
    getFarms(address?: string, vmQuery?: boolean): Promise<Farm[]>;
    private handleAddressesByGroupId;
    private getFarmInfo;
    getMetaEsdtsDetails(farmTokens: string[], address?: string): Promise<(StakeFarmToken | UnbondFarmToken)[]>;
    getApr(address: string): Promise<number | undefined>;
    getAnnualPercentageRewards(farmAddress: FarmAddresses): Promise<{
        apr: number | undefined;
        lockedApr: number | undefined;
    }>;
    getFarmTokenSupply(farmAddress: FarmAddresses): Promise<string>;
    decodeStakingTokenAttributes(args: DecodeAttributesArgs): StakingTokenAttributesModel[];
    decodeUnboundTokenAttributes(args: DecodeAttributesArgs): Promise<UnbondTokenAttributesModel[]>;
    private getUnbondigRemaingEpochs;
    stake(sender: string, args: StakingArgs): Promise<Transaction>;
    unstake(sender: string, args: UnstakingArgs): Promise<Transaction>;
    unbond(sender: string, args: StakingArgs): Promise<Transaction>;
    reinvest(sender: string, args: StakingArgs): Promise<Transaction>;
    harvest(sender: string, args: StakingArgs): Promise<Transaction>;
}
