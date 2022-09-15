export interface StakeGoldApiConfigService {
    getChainId(): string;
    getStakingMaxPercent(): string;
    getBlocksPerYear(): string;
}
