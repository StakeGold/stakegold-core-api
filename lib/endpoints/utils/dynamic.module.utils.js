"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicModuleUtils = void 0;
const serdnest_1 = require("serdnest");
class DynamicModuleUtils {
    static getCachingModule(cachingModuleOptions) {
        return serdnest_1.CachingModule.forRootAsync(cachingModuleOptions);
    }
}
exports.DynamicModuleUtils = DynamicModuleUtils;
//# sourceMappingURL=dynamic.module.utils.js.map