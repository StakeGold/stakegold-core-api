"use strict";
var MetaEsdtModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaEsdtModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const constants_1 = require("../utils/constants");
const meta_esdt_service_1 = require("./meta.esdt.service");
let MetaEsdtModule = MetaEsdtModule_1 = class MetaEsdtModule {
    static forRootAsync(elrondApiOptions) {
        const providers = [
            {
                provide: constants_1.STAKEGOLD_ELROND_API_SERVICE,
                useFactory: elrondApiOptions.useFactory,
                inject: elrondApiOptions.inject,
            },
            meta_esdt_service_1.MetaEsdtService,
        ];
        return {
            module: MetaEsdtModule_1,
            imports: [],
            providers,
            exports: [meta_esdt_service_1.MetaEsdtService],
        };
    }
};
MetaEsdtModule = MetaEsdtModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], MetaEsdtModule);
exports.MetaEsdtModule = MetaEsdtModule;
//# sourceMappingURL=meta.esdt.module.js.map