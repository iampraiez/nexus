/**
 * Logger implementation for Nexus SDK
 */

import type { ILogger } from "../types";

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger implements ILogger {
  private level: keyof typeof LOG_LEVELS;
  private prefix = "[Nexus SDK]";

  constructor(isDevelopment: boolean = false) {
    this.level = isDevelopment ? "debug" : "info";
  }

  debug(message: string, data?: unknown): void {
    this.log("debug", message, data);
  }

  info(message: string, data?: unknown): void {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log("warn", message, data);
  }

  error(message: string, error?: unknown): void {
    this.log("error", message, error);
  }

  private log(
    level: keyof typeof LOG_LEVELS,
    message: string,
    data?: unknown,
  ): void {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.level]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} ${this.prefix} [${level.toUpperCase()}] ${message}`;

    if (data !== undefined) {
      (console as any)[level](logMessage, data);
    } else {
      (console as any)[level](logMessage);
    }
  }
}
