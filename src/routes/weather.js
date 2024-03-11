import { Router } from 'express'
import { WeatherController } from '../controllers/weather.js'

export const createWeatherRouter = ({ weatherModel }) => {
    const weatherRouter = Router()
    const weatherController = new WeatherController({ weatherModel })

    const {
        getWeatherFromSomePlace,
        getWeatherForSpecificDate,
        getWeatherForSpecificDateDb
    } = weatherController

    weatherRouter.get('/location', getWeatherFromSomePlace)
    weatherRouter.get('/location-and-date', getWeatherForSpecificDate)
    weatherRouter.get('/location-and-date-db', getWeatherForSpecificDateDb)

    return weatherRouter
}