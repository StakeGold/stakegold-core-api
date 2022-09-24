"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicModuleUtils = void 0;
const erdnest_1 = require("@elrondnetwork/erdnest");
class DynamicModuleUtils {
    static getCachingModule(cachingModuleOptions) {
        return erdnest_1.CachingModule.forRootAsync(cachingModuleOptions);
    }
}
exports.DynamicModuleUtils = DynamicModuleUtils;
//# sourceMappingURL=dynamic.module.utils.js.map