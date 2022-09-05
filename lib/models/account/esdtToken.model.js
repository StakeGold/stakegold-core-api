"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = exports.EsdtToken = void 0;
class EsdtToken {
    constructor(init) {
        this.identifier = '';
        this.name = '';
        this.owner = '';
        this.ticker = '';
        this.circulatingSupply = '';
        this.supply = '';
        this.decimals = 0;
        this.isPaused = false;
        this.canUpgrade = false;
        this.canMint = false;
        this.canBurn = false;
        this.canChangeOwner = false;
        this.canPause = false;
        this.canFreeze = false;
        this.canWipe = false;
        this.type = '';
        Object.assign(this, init);
    }
}
exports.EsdtToken = EsdtToken;
class Assets {
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.Assets = Assets;
//# sourceMappingURL=esdtToken.model.js.map