export declare class MetricsService {
    private static apiCallsHistogram;
    private static externalCallsHistogram;
    private static pendingRequestsHistogram;
    private static apiResponseSizeHistogram;
    private static lastProcessedNonceGauge;
    private static pendingApiHitGauge;
    private static cachedApiHitGauge;
    private static isDefaultMetricsRegistered;
    private static redisDurationHistogram;
    private static gatewayDurationHistogram;
    private readonly logger;
    constructor();
    setApiCall(endpoint: string, status: number, duration: number, responseSize: number): void;
    setPendingRequestsCount(count: number): void;
    setExternalCall(system: string, duration: number): void;
    setLastProcessedNonce(shardId: number, nonce: number): void;
    incrementPendingApiHit(endpoint: string): void;
    incrementCachedApiHit(endpoint: string): void;
    setRedisDuration(action: string, duration: number): void;
    setGatewayDuration(name: string, duration: number): void;
    getMetrics(): Promise<string>;
    logError(error: any): void;
}
