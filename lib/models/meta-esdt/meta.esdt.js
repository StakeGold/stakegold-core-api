"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockedToken = exports.MetaEsdtDetailed = exports.MetaEsdt = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const LockedAssetAttributes_1 = require("../account/LockedAssetAttributes");
const esdt_type_1 = require("./esdt.type");
class MetaEsdt {
    constructor(init) {
        this.identifier = '';
        this.collection = '';
        this.attributes = '';
        this.nonce = 0;
        this.type = esdt_type_1.EsdtType.MetaESDT;
        this.balance = undefined;
        this.identifier = init.identifier;
        this.collection = init.collection;
        this.attributes = init.attributes;
        this.nonce = init.nonce;
        this.type = init.type;
        this.balance = init.balance;
    }
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], MetaEsdt.prototype, "identifier", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], MetaEsdt.prototype, "collection", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], MetaEsdt.prototype, "attributes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    tslib_1.__metadata("design:type", Number)
], MetaEsdt.prototype, "nonce", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: esdt_type_1.EsdtType }),
    tslib_1.__metadata("design:type", String)
], MetaEsdt.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    tslib_1.__metadata("design:type", Object)
], MetaEsdt.prototype, "balance", void 0);
exports.MetaEsdt = MetaEsdt;
class MetaEsdtDetailed extends MetaEsdt {
    constructor(init) {
        super(init);
        this.timestamp = undefined;
        this.name = '';
        this.creator = '';
        this.isWhitelistedStorage = false;
        this.decimals = undefined;
        this.ticker = '';
        this.timestamp = init.timestamp;
        this.name = init.name;
        this.creator = init.creator;
        this.isWhitelistedStorage = init.isWhitelistedStorage;
        this.decimals = init.decimals;
        this.ticker = init.ticker;
        this.assets = init.assets;
    }
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], MetaEsdtDetailed.prototype, "timestamp", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], MetaEsdtDetailed.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], MetaEsdtDetailed.prototype, "creator", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], MetaEsdtDetailed.prototype, "isWhitelistedStorage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true }),
    tslib_1.__metadata("design:type", Object)
], MetaEsdtDetailed.prototype, "decimals", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], MetaEsdtDetailed.prototype, "ticker", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Object)
], MetaEsdtDetailed.prototype, "assets", void 0);
exports.MetaEsdtDetailed = MetaEsdtDetailed;
class LockedToken {
    constructor(init) {
        this.identifier = '';
        this.nonce = 0;
        this.name = '';
        this.collection = '';
        this.balance = '0';
        this.decimals = undefined;
        this.ticker = '';
        this.unlockSchedule = [];
        Object.assign(this, init);
    }
    static fromMetaEsdt(esdt, unlockSchedule) {
        return new LockedToken({
            ticker: esdt.ticker,
            collection: esdt.collection,
            identifier: esdt.identifier,
            name: esdt.name,
            nonce: esdt.nonce,
            balance: esdt.balance,
            decimals: esdt.decimals,
            assets: esdt.assets,
            unlockSchedule,
        });
    }
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], LockedToken.prototype, "identifier", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    tslib_1.__metadata("design:type", Number)
], LockedToken.prototype, "nonce", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], LockedToken.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], LockedToken.prototype, "collection", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, nullable: true }),
    tslib_1.__metadata("design:type", String)
], LockedToken.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, nullable: true }),
    tslib_1.__metadata("design:type", Object)
], LockedToken.prototype, "decimals", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    tslib_1.__metadata("design:type", String)
], LockedToken.prototype, "ticker", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: LockedAssetAttributes_1.UnlockMilestone, isArray: true }),
    tslib_1.__metadata("design:type", Array)
], LockedToken.prototype, "unlockSchedule", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Object)
], LockedToken.prototype, "assets", void 0);
exports.LockedToken = LockedToken;
//# sourceMappingURL=meta.esdt.js.map