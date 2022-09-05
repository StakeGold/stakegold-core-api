export class AccountsModuleOptions {
  esdtTokens: string[] = [];
  metaEsdtCollection: string[] = [];
  farmTokens: Map<string, string> = new Map();

  constructor(
    esdtTokens: string[],
    metaEsdtCollection: string[],
    farmTokens: Map<string, string>
  ) {
    this.esdtTokens = esdtTokens;
    this.metaEsdtCollection = metaEsdtCollection;
    this.farmTokens = farmTokens;
  }

  getFarmTokensAddresses(): string[] {
    return Array.from(Object.keys(this.farmTokens));
  }
}
