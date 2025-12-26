export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
}

export interface ILogger {
  debug(message: string, context?: object): void;
  info(message: string, context?: object): void;
  warn(message: string, context?: object): void;
  error(message: string, error?: Error, context?: object): void;
  fatal(message: string, error?: Error, context?: object): void;
}

export class ConsoleLogger implements ILogger {
  constructor(private contextName: string = 'System') {}

  private log(level: LogLevel, message: string, context?: object) {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    console.log(`[${timestamp}] [${levelName}] [${this.contextName}]: ${message}`, context || '');
  }

  debug(message: string, context?: object) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: object) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: object) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: object) {
    console.error(`[ERROR] [${this.contextName}]: ${message}`, error, context || '');
  }

  fatal(message: string, error?: Error, context?: object) {
    console.error(`[FATAL] [${this.contextName}]: ${message}`, error, context || '');
  }
}
