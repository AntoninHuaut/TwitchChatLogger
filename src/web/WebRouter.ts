import express from 'express'
import path from 'path';
import Database from '../Database';
import config from '../config/index';

export default class WebRouter {

    private static LIMIT_MIN: number = 1
    private static LIMIT_DEFAULT: number = 20
    private static LIMIT_MAX: number = 100

    private static OFFSET_MIN: number = 0
    private static OFFSET_DEFAULT: number = 0

    private app: express.Application

    constructor(app: express.Application) {
        this.app = app
    }

    setup() {
        const router: express.Router = express.Router()
        router.use(express.static(path.join(__dirname, 'public')))

        router.get('/:key?', (req, res) => {
            if (req.params.key !== config.web.key) return res.status(403).send({error: 'Unauthorized'});

            res.render('index', {
                title: "TwitchChatLogger",
                key: req.params.key
            })
        })

        router.get('/api/user_message/:key?', async (req, res) => {
            if (req.params.key !== config.web.key) return res.status(403).send({error: 'Unauthorized'});

            const search: string = this.safeString(req.query.search, '')
            const offset: number = this.safeNumber(req.query.offset, WebRouter.OFFSET_DEFAULT, WebRouter.OFFSET_MIN, null)
            const limit: number = this.safeNumber(req.query.limit, WebRouter.LIMIT_DEFAULT, WebRouter.LIMIT_MIN, WebRouter.LIMIT_MAX)

            const [rows]: any[] = await Database.getUserMessage(search, offset, limit)
            const totalUserMessage = await Database.getTotalUserMessage()

            res.send({
                total: totalUserMessage,
                totalNotFiltered: rows.length,
                rows: rows
            })
        })

        this.app.use(router)
    }

    safeString(value: string, defaultValue: string) {
        return (value ?? defaultValue).trim()
    }

    safeNumber(value: string, defaultValue: number, min: number | null, max: number | null) {
        const numberValue: number = Number.parseInt(value)
        if (!value || Number.isNaN(numberValue) || (min && numberValue < min) || (max && numberValue > max)) {
            return defaultValue
        }
        return numberValue
    }
}