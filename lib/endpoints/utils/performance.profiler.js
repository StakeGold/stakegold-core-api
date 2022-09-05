"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceProfiler = void 0;
const common_1 = require("@nestjs/common");
class PerformanceProfiler {
    constructor(description = '') {
        this.stopped = 0;
        this.duration = 0;
        this.started = this.now();
        this.description = description;
    }
    stop(description = null, log = false) {
        this.stopped = this.now();
        this.duration = this.stopped - this.started;
        if (log) {
            const logger = new common_1.Logger(PerformanceProfiler.name);
            logger.log(`${description !== null && description !== void 0 ? description : this.description}: ${this.duration.toFixed(3)}ms`);
        }
    }
    now() {
        const hrTime = process.hrtime();
        return hrTime[0] * 1000 + hrTime[1] / 1000000;
    }
    static async profile(description, promise) {
        const profiler = new PerformanceProfiler();
        try {
            if (promise instanceof Function) {
                return await promise();
            }
            else {
                return await promise;
            }
        }
        finally {
            profiler.stop(description, true);
        }
    }
}
exports.PerformanceProfiler = PerformanceProfiler;
//# sourceMappingURL=performance.profiler.js.map