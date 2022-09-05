"use strict";
var MetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
let MetricsService = MetricsService_1 = class MetricsService {
    constructor() {
        this.logger = new common_1.Logger(MetricsService_1.name);
        if (!MetricsService_1.apiCallsHistogram) {
            MetricsService_1.apiCallsHistogram = new prom_client_1.Histogram({
                name: 'api_calls',
                help: 'API Calls',
                labelNames: ['endpoint', 'code'],
                buckets: [],
            });
        }
        if (!MetricsService_1.externalCallsHistogram) {
            MetricsService_1.externalCallsHistogram = new prom_client_1.Histogram({
                name: 'external_apis',
                help: 'External Calls',
                labelNames: ['system'],
                buckets: [],
            });
        }
        if (!MetricsService_1.pendingRequestsHistogram) {
            MetricsService_1.pendingRequestsHistogram = new prom_client_1.Gauge({
                name: 'pending_requests',
                help: 'Pending requests',
                labelNames: ['endpoint'],
            });
        }
        if (!MetricsService_1.apiResponseSizeHistogram) {
            MetricsService_1.apiResponseSizeHistogram = new prom_client_1.Histogram({
                name: 'api_response_size',
                help: 'API Response size',
                labelNames: ['endpoint'],
                buckets: [],
            });
        }
        if (!MetricsService_1.pendingApiHitGauge) {
            MetricsService_1.pendingApiHitGauge = new prom_client_1.Gauge({
                name: 'pending_api_hits',
                help: 'Number of hits for pending API calls',
                labelNames: ['endpoint'],
            });
        }
        if (!MetricsService_1.cachedApiHitGauge) {
            MetricsService_1.cachedApiHitGauge = new prom_client_1.Gauge({
                name: 'cached_api_hits',
                help: 'Number of hits for cached API calls',
                labelNames: ['endpoint'],
            });
        }
        if (!MetricsService_1.isDefaultMetricsRegistered) {
            MetricsService_1.isDefaultMetricsRegistered = true;
            (0, prom_client_1.collectDefaultMetrics)();
        }
        if (!MetricsService_1.redisDurationHistogram) {
            MetricsService_1.redisDurationHistogram = new prom_client_1.Histogram({
                name: 'redis_duration',
                help: 'Redis Duration',
                labelNames: ['action'],
                buckets: [],
            });
        }
        if (!MetricsService_1.gatewayDurationHistogram) {
            MetricsService_1.gatewayDurationHistogram = new prom_client_1.Histogram({
                name: 'gateway_duration',
                help: 'Gateway Duration',
                labelNames: ['endpoint'],
                buckets: [],
            });
        }
    }
    setApiCall(endpoint, status, duration, responseSize) {
        MetricsService_1.apiCallsHistogram.labels(endpoint, status.toString()).observe(duration);
        MetricsService_1.apiResponseSizeHistogram.labels(endpoint).observe(responseSize);
    }
    setPendingRequestsCount(count) {
        MetricsService_1.pendingRequestsHistogram.set(count);
    }
    setExternalCall(system, duration) {
        MetricsService_1.externalCallsHistogram.labels(system).observe(duration);
    }
    setLastProcessedNonce(shardId, nonce) {
        MetricsService_1.lastProcessedNonceGauge.set({ shardId }, nonce);
    }
    incrementPendingApiHit(endpoint) {
        MetricsService_1.pendingApiHitGauge.inc({ endpoint });
    }
    incrementCachedApiHit(endpoint) {
        MetricsService_1.cachedApiHitGauge.inc({ endpoint });
    }
    setRedisDuration(action, duration) {
        MetricsService_1.redisDurationHistogram.labels(action).observe(duration);
    }
    setGatewayDuration(name, duration) {
        MetricsService_1.gatewayDurationHistogram.labels(name).observe(duration);
    }
    async getMetrics() {
        return prom_client_1.register.metrics();
    }
    logError(error) {
        this.logger.log('Dapp ' + JSON.stringify(error));
    }
};
MetricsService.isDefaultMetricsRegistered = false;
MetricsService = MetricsService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], MetricsService);
exports.MetricsService = MetricsService;
//# sourceMappingURL=metrics.service.js.map