import {ChatClient, ClearchatMessage, PrivmsgMessage} from 'dank-twitch-irc'
import config from './config/index'
import Logger from "./Logger"
import Database from "./Database"

export default class IRCClient {

    private client: ChatClient

    constructor() {
        this.client = new ChatClient()

        this.client.on("ready", () => console.log(" -> Successfully connected to chat"))
        this.client.on("close", (error: Error) => {
            if (error != null) {
                console.error("Client closed due to error", error)
            }
        })
    }

    async init() {
        this.client.on('CLEARCHAT', IRCClient.handleTimeoutBan)
        this.client.on('PRIVMSG', IRCClient.handleUserMessage)

        await this.client.connect()

        let channels: string[] = []

        for (let entry of Object.entries(config.channels)) {
            entry[1] = entry[1].map((channelName: string) => channelName.toLowerCase())
            console.info(` -> Loading ${entry[0]} with ${entry[1].length} channel(s)`)
            channels = channels.concat(channels, entry[1])
        }

        await this.client.joinAll(channels)
    }

    private static async handleUserMessage(pMsg: PrivmsgMessage) {
        Logger.debug(`MSG [#${pMsg.channelName}(${pMsg.channelID})] ${pMsg.displayName}(${pMsg.senderUserID}): ${pMsg.messageText}`)
        await Database.insertUserMessage(pMsg.channelName, pMsg.channelID, pMsg.senderUsername, pMsg.senderUserID, pMsg.messageText)
    }

    private static async handleTimeoutBan(ccMsg: ClearchatMessage) {
        Logger.debug(`BAN [#${ccMsg.channelName}(${ccMsg.ircTags['room-id']})] ${ccMsg.targetUsername}(${ccMsg.ircTags['target-user-id']}) for ${ccMsg.banDuration} second(s)`)
        await Database.insertTimeoutBan(ccMsg.channelName, ccMsg.ircTags['room-id'], ccMsg.targetUsername, ccMsg.ircTags['target-user-id'], ccMsg.banDuration)
    }
}