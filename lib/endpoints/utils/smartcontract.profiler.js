"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartContractProfiler = void 0;
const tslib_1 = require("tslib");
const out_1 = require("@elrondnetwork/erdjs/out");
const common_1 = require("@nestjs/common");
const performance_profiler_1 = require("./performance.profiler");
const serdnest_1 = require("serdnest");
let SmartContractProfiler = class SmartContractProfiler extends out_1.SmartContract {
    constructor(metricsService, scData) {
        super(scData);
        this.metricsService = metricsService;
    }
    async runQuery(provider, { func, args, value, caller, }) {
        const profiler = new performance_profiler_1.PerformanceProfiler();
        const query = super.createQuery({
            func,
            args,
            value,
            caller,
        });
        const queryResponse = await provider.queryContract(query);
        profiler.stop();
        this.metricsService.setExternalCall(func.name, profiler.duration);
        return queryResponse;
    }
};
SmartContractProfiler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [serdnest_1.MetricsService, Object])
], SmartContractProfiler);
exports.SmartContractProfiler = SmartContractProfiler;
//# sourceMappingURL=smartcontract.profiler.js.map