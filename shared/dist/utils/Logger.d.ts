export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}
export interface ILogger {
    debug(message: string, context?: object): void;
    info(message: string, context?: object): void;
    warn(message: string, context?: object): void;
    error(message: string, error?: Error, context?: object): void;
    fatal(message: string, error?: Error, context?: object): void;
}
export declare class ConsoleLogger implements ILogger {
    private contextName;
    constructor(contextName?: string);
    private log;
    debug(message: string, context?: object): void;
    info(message: string, context?: object): void;
    warn(message: string, context?: object): void;
    error(message: string, error?: Error, context?: object): void;
    fatal(message: string, error?: Error, context?: object): void;
}
