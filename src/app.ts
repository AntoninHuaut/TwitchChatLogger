import IRCClient from './IRCClient'
import Database from "./Database"
import Logger from "./Logger"
import WebApp from "./web/WebApp";

(async () => {
    Logger.setLogEnable(false)

    await Database.createTables()
    await new IRCClient().init()
    new WebApp()
})()