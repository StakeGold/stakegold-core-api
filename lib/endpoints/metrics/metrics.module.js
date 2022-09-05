"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
let MetricsModule = class MetricsModule {
};
MetricsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [
            metrics_service_1.MetricsService,
        ],
        exports: [
            metrics_service_1.MetricsService,
        ],
    })
], MetricsModule);
exports.MetricsModule = MetricsModule;
//# sourceMappingURL=metrics.module.js.map