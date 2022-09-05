import { StakingArgs, UnstakingArgs } from "../../../models/staking/staking.args";
import { TransactionModel } from "../../../models/staking/transaction.model";
import { StakeGoldApiConfigService } from "../../api-config/api-config.service";
import { ContextTransactionsService } from "../../context/context.transactions.service";
import { StakeGoldElrondProxyService } from "../../elrond-communication/elrond-proxy.service";
export declare class TransactionsFarmService {
    private readonly elrondProxy;
    private readonly contextTransactions;
    private readonly apiConfigService;
    constructor(elrondProxy: StakeGoldElrondProxyService, contextTransactions: ContextTransactionsService, apiConfigService: StakeGoldApiConfigService);
    stake(sender: string, args: StakingArgs): Promise<TransactionModel>;
    unstake(sender: string, args: UnstakingArgs): Promise<TransactionModel>;
    unbond(sender: string, args: StakingArgs): Promise<TransactionModel>;
    harvest(sender: string, args: StakingArgs): Promise<TransactionModel>;
    reinvest(sender: string, args: StakingArgs): Promise<TransactionModel>;
    private SftFarmInteraction;
}
