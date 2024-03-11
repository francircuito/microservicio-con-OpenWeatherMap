import express, { json } from 'express'
import 'dotenv/config'
import { createWeatherRouter } from './routes/weather.js'

const createApp = ({ weatherModel }) => {
    const app = express()
    app.use(json())
    app.disable('x-powered-by')

    app.use('/forecast', createWeatherRouter({ weatherModel }))

    const PORT = process.env.SERVER_PORT ?? 80

    app.listen(PORT, () => {
        console.log(`🚀 Server listening on port http://localhost:${PORT}`)
    })
}

export default createApp