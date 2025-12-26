"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 4] = "FATAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class ConsoleLogger {
    contextName;
    constructor(contextName = 'System') {
        this.contextName = contextName;
    }
    log(level, message, context) {
        const timestamp = new Date().toISOString();
        const levelName = LogLevel[level];
        console.log(`[${timestamp}] [${levelName}] [${this.contextName}]: ${message}`, context || '');
    }
    debug(message, context) {
        this.log(LogLevel.DEBUG, message, context);
    }
    info(message, context) {
        this.log(LogLevel.INFO, message, context);
    }
    warn(message, context) {
        this.log(LogLevel.WARN, message, context);
    }
    error(message, error, context) {
        console.error(`[ERROR] [${this.contextName}]: ${message}`, error, context || '');
    }
    fatal(message, error, context) {
        console.error(`[FATAL] [${this.contextName}]: ${message}`, error, context || '');
    }
}
exports.ConsoleLogger = ConsoleLogger;
