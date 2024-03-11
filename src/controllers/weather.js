import { WeatherSchema } from '../schemas/weather.js'
const {
    getWeatherFromSomePlaceValidation,
    getWeatherForSpecificDateValidation
} = WeatherSchema

export class WeatherController {
    constructor({ weatherModel }) {
        this.weatherModel = weatherModel
    }

    getWeatherFromSomePlace = async (req, res) => {
        try {
            const { query } = req
            const { latitude, longitude, exclude } = query
            // Capa de validación
            await getWeatherFromSomePlaceValidation({ latitude, longitude, exclude })
            const hourlyAndDailyWeather = await this.weatherModel.getWeatherFromSomePlace(
                {
                    latitude,
                    longitude
                }
            )
            res.status(200).json(hourlyAndDailyWeather)
        } catch (error) {
            console.log(error)
            if (error.details) {
                console.log(error.details[0].message);
                res.status(error.statusCode ?? 406).json({
                    message: error.details[0].message ?? 'Validation error',
                    typeError: error.typeError ?? 'validationError'
                })
            }
            else {
                res.status(error.statusCode ?? 500).json({
                    message: error.message ?? 'Server internal error',
                    typeError: error.typeError ?? 'serverError'
                })
            }
        }
    }

    getWeatherForSpecificDate = async (req, res) => {
        try {
            const { query } = req
            const { latitude, longitude, date, hour } = query
            // Capa de validación
            await getWeatherForSpecificDateValidation({ latitude, longitude, date, hour })
            const forecastData = await this.weatherModel.getWeatherForSpecificDate(
                {
                    latitude,
                    longitude,
                    date,
                    hour
                }
            )
            res.status(200).json(forecastData)
        } catch (error) {
            if (error.details) {
                console.log(error.details[0].message);
                res.status(error.statusCode ?? 406).json({
                    message: error.details[0].message ?? 'Validation error',
                    typeError: error.typeError ?? 'validationError'
                })
            }
            else {
                res.status(error.statusCode ?? 500).json({
                    message: error.message ?? 'Server internal error',
                    typeError: error.typeError ?? 'serverError'
                })
            }
        }
    }

    getWeatherForSpecificDateDb = async (req, res) => {
        try {
            const { query } = req
            const { latitude, longitude, date, hour } = query
            // Capa de validación
            await getWeatherForSpecificDateValidation({ latitude, longitude, date, hour })
            const forecastData = await this.weatherModel.getWeatherForSpecificDateDb(
                {
                    latitude,
                    longitude,
                    date,
                    hour
                }
            )
            res.status(200).json(forecastData)
        } catch (error) {
            if (error.details) {
                console.log(error.details[0].message);
                res.status(error.statusCode ?? 406).json({
                    message: error.details[0].message ?? 'Validation error',
                    typeError: error.typeError ?? 'validationError'
                })
            }
            else {
                res.status(error.statusCode ?? 500).json({
                    message: error.message ?? 'Server internal error',
                    typeError: error.typeError ?? 'serverError'
                })
            }
        }
    }
}