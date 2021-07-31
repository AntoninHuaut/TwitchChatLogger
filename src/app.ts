import IRCClient from './IRCClient'
import Database from "./Database"
import Logger from "./Logger"

(async () => {
    Logger.setLogEnable(false)

    await Database.createTables()
    await new IRCClient().init()
})()