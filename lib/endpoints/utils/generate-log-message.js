"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRunQueryLogMessage = exports.generateGetLogMessage = exports.generateLogMessage = void 0;
var LogType;
(function (LogType) {
    LogType["GET"] = "get";
    LogType["SET"] = "set";
    LogType["DELETE"] = "delete";
    LogType["COMPUTE"] = "compute";
    LogType["RUN_QUERY"] = "runQuery";
})(LogType || (LogType = {}));
const generateLogMessage = (className, methodName, messageKey, error, logType) => {
    const path = `${className}.${methodName}`;
    const message = logType
        ? `An error occurred while ${logType} ${messageKey}`
        : `An error occurred while ${messageKey}`;
    return {
        message,
        path,
        error,
    };
};
exports.generateLogMessage = generateLogMessage;
const generateGetLogMessage = (className, methodName, messageKey, error) => {
    return (0, exports.generateLogMessage)(className, methodName, messageKey, error, LogType.GET);
};
exports.generateGetLogMessage = generateGetLogMessage;
const generateRunQueryLogMessage = (className, methodName, error) => {
    return (0, exports.generateLogMessage)(className, methodName, '', error, LogType.RUN_QUERY);
};
exports.generateRunQueryLogMessage = generateRunQueryLogMessage;
//# sourceMappingURL=generate-log-message.js.map