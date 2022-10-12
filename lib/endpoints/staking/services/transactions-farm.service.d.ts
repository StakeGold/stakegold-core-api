import { InputToken } from '../../../models/staking';
import { StakingArgs, UnstakingArgs } from '../../../models/staking/staking.args';
import { Transaction } from '../../../models/staking/transaction.model';
import { StakeGoldApiConfigService } from '../../api-config/api-config.service';
import { ContextTransactionsService } from '../../context/context.transactions.service';
import { StakeGoldElrondProxyService } from '../../elrond-communication/elrond-proxy.service';
import { StakingGetterService } from './staking.getter.service';
export declare class TransactionsFarmService {
    private readonly elrondProxy;
    private readonly contextTransactions;
    private readonly apiConfigService;
    private readonly stakingGetterService;
    constructor(elrondProxy: StakeGoldElrondProxyService, contextTransactions: ContextTransactionsService, apiConfigService: StakeGoldApiConfigService, stakingGetterService: StakingGetterService);
    stake(sender: string, groupId: string, args: StakingArgs): Promise<Transaction>;
    lockAndStake(sender: string, groupId: string, args: StakingArgs): Promise<Transaction>;
    mergeTokens(sender: string, tokens: InputToken[]): Promise<Transaction>;
    unlockToken(sender: string, token: InputToken): Promise<Transaction>;
    unstake(sender: string, args: UnstakingArgs): Promise<Transaction>;
    unbond(sender: string, args: StakingArgs): Promise<Transaction>;
    harvest(sender: string, args: StakingArgs): Promise<Transaction>;
    reinvest(sender: string, args: StakingArgs): Promise<Transaction>;
    private SftFarmInteraction;
}
