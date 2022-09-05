export declare class AccountsModuleOptions {
    esdtTokens: string[];
    metaEsdtCollection: string[];
    farmTokens: Map<string, string>;
    constructor(esdtTokens: string[], metaEsdtCollection: string[], farmTokens: Map<string, string>);
    getFarmTokensAddresses(): string[];
}
