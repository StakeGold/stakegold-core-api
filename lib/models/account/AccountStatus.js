"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
class AccountStatus {
    constructor(init) {
        this.egldBalance = "0";
        this.balances = [];
        this.addressBuys = "0";
        this.whitelisted = false;
        Object.assign(this, init);
    }
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: "The amount of EGLD held by this wallet" }),
    tslib_1.__metadata("design:type", String)
], AccountStatus.prototype, "egldBalance", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: "The amount of ESDT token held by this wallet" }),
    tslib_1.__metadata("design:type", Array)
], AccountStatus.prototype, "balances", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: "How much UPARK has bought" }),
    tslib_1.__metadata("design:type", String)
], AccountStatus.prototype, "addressBuys", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Flag which states if the address is whitelisted",
    }),
    tslib_1.__metadata("design:type", Boolean)
], AccountStatus.prototype, "whitelisted", void 0);
exports.AccountStatus = AccountStatus;
//# sourceMappingURL=AccountStatus.js.map