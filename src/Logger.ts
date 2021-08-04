import * as pino from 'pino'

export default class Logger {

    private static logEnable: boolean = false

    private static fileLogger = pino.pino({
        prettyPrint: {
            colorize: false,
            ignore: 'pid,hostname',
            translateTime: 'SYS:standard'
        }
    }, './log')

    public static debug(message: string) {
        if (Logger.logEnable) {
            Logger.fileLogger.info({}, message)
        }
    }

    public static setLogEnable(logEnable: boolean) {
        Logger.logEnable = logEnable
    }
}