export declare class PerformanceProfiler {
    started: number;
    description: string;
    stopped: number;
    duration: number;
    constructor(description?: string);
    stop(description?: string | null, log?: boolean): void;
    private now;
    static profile<T>(description: string, promise: Promise<T> | (() => Promise<T>)): Promise<T>;
}
