import { StakingArgs, UnstakingArgs } from '../../../models/staking/staking.args';
import { Transaction } from '../../../models/staking/transaction.model';
import { StakeGoldApiConfigService } from '../../api-config/api-config.service';
import { ContextTransactionsService } from '../../context/context.transactions.service';
import { StakeGoldElrondProxyService } from '../../elrond-communication/elrond-proxy.service';
export declare class TransactionsFarmService {
    private readonly elrondProxy;
    private readonly contextTransactions;
    private readonly apiConfigService;
    constructor(elrondProxy: StakeGoldElrondProxyService, contextTransactions: ContextTransactionsService, apiConfigService: StakeGoldApiConfigService);
    stake(sender: string, args: StakingArgs): Promise<Transaction>;
    lockAndStake(sender: string, groupId: string, args: StakingArgs): Promise<Transaction>;
    unstake(sender: string, args: UnstakingArgs): Promise<Transaction>;
    unbond(sender: string, args: StakingArgs): Promise<Transaction>;
    harvest(sender: string, args: StakingArgs): Promise<Transaction>;
    reinvest(sender: string, args: StakingArgs): Promise<Transaction>;
    private SftFarmInteraction;
}
