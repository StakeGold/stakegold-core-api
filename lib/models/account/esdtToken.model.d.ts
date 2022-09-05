export declare class EsdtToken {
    identifier: string;
    name: string;
    owner: string;
    ticker: string;
    circulatingSupply: string;
    supply: string;
    decimals: number;
    isPaused: boolean;
    canUpgrade: boolean;
    canMint: boolean;
    canBurn: boolean;
    canChangeOwner: boolean;
    canPause: boolean;
    canFreeze: boolean;
    canWipe: boolean;
    type: string;
    balance?: string;
    assets?: Assets;
    constructor(init?: Partial<EsdtToken>);
}
export declare class Assets {
    svgUrl?: string;
    constructor(init?: Partial<Assets>);
}
