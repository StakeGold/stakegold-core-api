"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaEsdtService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const constants_1 = require("../utils/constants");
let MetaEsdtService = class MetaEsdtService {
    constructor(elrondApiService) {
        this.elrondApiService = elrondApiService;
    }
    async getMetaEsdts(address, collections) {
        var _a;
        const metaEsdts = (_a = (await this.elrondApiService.getMetaEsdts(address, collections))) !== null && _a !== void 0 ? _a : [];
        return metaEsdts;
    }
};
MetaEsdtService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.STAKEGOLD_ELROND_API_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [Object])
], MetaEsdtService);
exports.MetaEsdtService = MetaEsdtService;
//# sourceMappingURL=meta.esdt.service.js.map