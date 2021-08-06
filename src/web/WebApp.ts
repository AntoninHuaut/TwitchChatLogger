import express from 'express'
import path from 'path'
import config from '../config/index'
import WebRouter from "./WebRouter";

export default class WebApp {

    constructor() {
        const app: express.Application = express()
        app.set('view engine', 'ejs')
        app.set('views', path.join(__dirname, 'views'))

        new WebRouter(app).setup()

        app.listen(config.web.port)
        console.log(`Web server started on port ${config.web.port}`)
    }
}