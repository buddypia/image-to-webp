import Log4js from "Log4js";
import path from "path";
export class Logger {
  static init() {
    Log4js.configure({
      appenders: {
        access: {
          type: "dateFile",
          filename: path.join("logs", "access.log"),
        },
        error: {
          type: "dateFile",
          filename: path.join("logs", "error.log"),
        },
        system: {
          type: "dateFile",
          filename: path.join("logs", "system.log"),
        },
        console: {
          type: "console",
        },
        stdout: {
          type: "stdout",
        },
      },
      categories: {
        default: {
          appenders: ["access", "stdout"],
          level: "INFO",
        },
        access: {
          appenders: ["access", "stdout"],
          level: "INFO",
        },
        system: {
          appenders: ["system", "stdout"],
          level: "ALL",
        },
        error: {
          appenders: ["error", "console", "stdout"],
          level: "WARN",
        },
      },
    });
  }

  // access
  static accessFatal(message) {
    Log4js.getLogger("access").fatal(message);
  }
  static accessError(message) {
    Log4js.getLogger("access").error(message);
  }
  static accessWarning(message) {
    Log4js.getLogger("access").warn(message);
  }
  static accessInfo(message) {
    Log4js.getLogger("access").info(message);
  }
  static accessDebug(message) {
    Log4js.getLogger("access").debug(message);
  }
  static accessTrace(message) {
    Log4js.getLogger("access").trace(message);
  }

  // system
  static systemFatal(message) {
    Log4js.getLogger("system").fatal(message);
  }
  static systemError(message) {
    Log4js.getLogger("system").error(message);
  }
  static systemWarning(message) {
    Log4js.getLogger("system").warn(message);
  }
  static systemInfo(message) {
    Log4js.getLogger("system").info(message);
  }
  static systemDebug(message) {
    Log4js.getLogger("system").debug(message);
  }
  static systemTrace(message) {
    Log4js.getLogger("system").trace(message);
  }
}
export default Logger;
