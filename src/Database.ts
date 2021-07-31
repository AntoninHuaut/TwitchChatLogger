import {Connection, createConnection} from 'mysql2/promise'
import config from './config/index'

export default class Database {

    private static PREFIX_TABLE: string = 'tcl_'
    private static MESSAGE_TABLE: string = `${Database.PREFIX_TABLE}user_message`
    private static SANCTION_TABLE: string = `${Database.PREFIX_TABLE}user_sanction`

    private constructor() {
        // Prevents the creation of an instance
    }

// @formatter:off
    public static async createTables() {
        const client: Connection = await this.getConnection()

        await client.query(`CREATE TABLE IF NOT EXISTS ${Database.MESSAGE_TABLE} (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                channelName VARCHAR(64) NOT NULL,
                channelId   VARCHAR(64) NOT NULL,
                userName    VARCHAR(64) NOT NULL,
                userId      VARCHAR(64) NOT NULL,
                userMessage TEXT        NOT NULL,
                messageDate TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`)
        await client.query(`CREATE TABLE IF NOT EXISTS ${Database.SANCTION_TABLE} (
                id           INT AUTO_INCREMENT PRIMARY KEY,
                channelName  VARCHAR(64) NOT NULL,
                channelId    VARCHAR(64) NOT NULL,
                userName     VARCHAR(64) NOT NULL,
                userId       VARCHAR(64) NOT NULL,
                banDuration  INT         NULL,
                sanctionDate TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`)

        await client.end()
    }
    // @formatter:on

    // @formatter:off
    public static async insertUserMessage(channelName: string, channelId: string, userName: string, userId: string, messageText: string) {
        const client: Connection = await this.getConnection()

        await client.query(`
            INSERT INTO ${Database.MESSAGE_TABLE} (channelName, channelId, userName, userId, userMessage) VALUES (?, ?, ?, ?, ?)`,
            [channelName, channelId, userName, userId, messageText]
        )

        await client.end()
    }
    // @formatter:on

    // @formatter:off
    public static async insertTimeoutBan(channelName: string, channelId: string, userName: string, userId: string, banDuration: number) {
        const client: Connection = await this.getConnection()

        await client.query(`
            INSERT INTO ${Database.SANCTION_TABLE} (channelName, channelId, userName, userId, banDuration) VALUES (?, ?, ?, ?, ?)`,
            [channelName, channelId, userName, userId, banDuration]
        )

        await client.end()
    }
    // @formatter:on

    private static async getConnection(): Promise<Connection> {
        return await createConnection({
            host: config.sql.host,
            port: config.sql.port,
            database: config.sql.database,
            user: config.sql.user,
            password: config.sql.password
        })
    }
}