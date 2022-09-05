declare enum LogType {
    GET = "get",
    SET = "set",
    DELETE = "delete",
    COMPUTE = "compute",
    RUN_QUERY = "runQuery"
}
export declare const generateLogMessage: (className: string, methodName: string, messageKey: string, error: any, logType?: LogType) => {
    message: string;
    path: string;
    error: any;
};
export declare const generateGetLogMessage: (className: string, methodName: string, messageKey: string, error: any) => {
    message: string;
    path: string;
    error: any;
};
export declare const generateRunQueryLogMessage: (className: string, methodName: string, error: any) => {
    message: string;
    path: string;
    error: any;
};
export {};
