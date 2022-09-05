export class EsdtToken {
    identifier: string = '';
    name: string = '';
    owner: string = '';
    ticker: string = '';
    circulatingSupply: string = '';
    supply: string = '';
    decimals: number = 0;
    isPaused: boolean = false;
    canUpgrade: boolean = false;
    canMint: boolean = false;
    canBurn: boolean = false;
    canChangeOwner: boolean = false;
    canPause: boolean = false;
    canFreeze: boolean = false;
    canWipe: boolean = false;
    type: string = '';
    balance?: string;
    assets?: Assets;

    constructor(init?: Partial<EsdtToken>) {
        Object.assign(this, init);
    }
}

export class Assets {
    svgUrl?: string;

    constructor(init?: Partial<Assets>) {
        Object.assign(this, init);
    }
}

