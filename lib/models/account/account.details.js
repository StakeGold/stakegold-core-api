"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDetails = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const meta_esdt_1 = require("../meta-esdt/meta.esdt");
const esdtToken_model_1 = require("./esdtToken.model");
class AccountDetails {
    constructor(init) {
        this.egldBalance = "0";
        this.esdtTokens = [];
        this.lockedTokens = new Map();
        this.farmTokens = [];
        Object.assign(this, init);
    }
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'EGLD balance of the account', type: String }),
    tslib_1.__metadata("design:type", String)
], AccountDetails.prototype, "egldBalance", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ESDT tokens owned by the account', type: esdtToken_model_1.EsdtToken, isArray: true }),
    tslib_1.__metadata("design:type", Array)
], AccountDetails.prototype, "esdtTokens", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Locked tokens owned by this account', type: meta_esdt_1.LockedToken, isArray: true }),
    tslib_1.__metadata("design:type", Map)
], AccountDetails.prototype, "lockedTokens", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Farm tokens owned by this account', type: meta_esdt_1.MetaEsdt, isArray: true }),
    tslib_1.__metadata("design:type", Array)
], AccountDetails.prototype, "farmTokens", void 0);
exports.AccountDetails = AccountDetails;
//# sourceMappingURL=account.details.js.map