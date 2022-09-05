export interface StakeGoldApiConfigService {
  getChainId(): string;

  getStakingMaxPercent(): string;

  getBlocksPerYear(): string;

  getFarmTokens(): Map<string, string>;
}
