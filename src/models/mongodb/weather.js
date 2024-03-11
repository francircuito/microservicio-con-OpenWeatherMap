import { MongoDBClient } from '../../db/database.js'
import { MongoClient } from 'mongodb'
import axios from 'axios'
import moment from 'moment'
import CustomError from '../../utils/errorClass.js'
import { WeatherSchema } from '../../schemas/weather.js'
const {
    getWeatherForSpecificDateValidation
} = WeatherSchema

const OpenWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY
const mongodbUrl = process.env.MONGODB_URL
const mongodbName = process.env.MONGODB_DBNAME

export class WeatherModel {
    static async getWeatherFromSomePlace({ latitude, longitude }) {
        const client = await MongoClient.connect(mongodbUrl)
        try {
            const { select, update, insert } = MongoDBClient
            // inicializamos query operator
            const collectionName = 'weatherData'
            const db = client.db(mongodbName);
            const collection = db.collection(collectionName)
            // guardamos la fecha y hora de la solicitud
            const currentMomentToSaved = moment().format('YYYY-MM-DD HH:mm:ss')
            const currentMoment = moment()
            const location = `${latitude},${longitude}`
            const locationData = await select(collection, 'location', location)
            console.log('locationData:', locationData)
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OpenWeatherMapApiKey}`
            const forecastData = await axios.get(url)
            const { data } = forecastData
            const forescastData = {
                forecastData: data
            }

            // comprobamos que hayan datos en la request, sino, lanzamos 204
            if (!data) {
                let errorMessage = 'No weather data for that location.'
                throw new CustomError(errorMessage, 204)
            }

            if (locationData) {
                const { date } = locationData
                const currentSavedDate = moment(date)
                const hoursOfDifference = currentMoment.diff(currentSavedDate, 'hours')
                const checkHoursDifference = hoursOfDifference < 3

                if (checkHoursDifference) return locationData

                return await update(
                    collection,
                    'location',
                    location,
                    forescastData,
                    currentMomentToSaved
                )
            }

            await insert(collection, { location, data, currentMomentToSaved })
            return forescastData
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            // Cerrar la conexión con MongoDB
            await client.close();
            console.log('Connection closed');
        }
    }

    static async getWeatherForSpecificDate({ latitude, longitude, date, hour }) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OpenWeatherMapApiKey}`
            const hourlyAndDailyWeather = await axios.get(url)
            const { data } = hourlyAndDailyWeather

            // comprobamos que hayan datos en la request, sino, lanzamos 204
            if (!data) {
                let errorMessage = 'No weather data for that location.'
                throw new CustomError(errorMessage, 204)
            }

            const dataValidated = await getWeatherForSpecificDateValidation({ latitude, longitude, date, hour })
            console.log('dataValidated:', dataValidated)
            const userDate = moment(`${date} ${dataValidated.hour}`)
            const { list } = data
            const forecastDates = list.filter(
                forecast => moment(forecast.dt_txt).isSame(userDate)
            )

            // comprobamos que existan en la api la fecha y hora proporcionadas
            if (!forecastDates.length) {
                let errorMessage = 'No data for provided date.'
                throw new CustomError(errorMessage, 204)
            }

            return forecastDates[0]
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            // Cerrar la conexión con MongoDB
            await client.close();
            console.log('Connection closed');
        }
    }

    static async getWeatherForSpecificDateDb({ latitude, longitude, date, hour }) {
        const client = await MongoClient.connect(mongodbUrl)
        try {
            const { select } = MongoDBClient

            const collectionName = 'weatherData'
            const db = client.db(mongodbName);
            const collection = db.collection(collectionName)

            const providedLocation = `${latitude},${longitude}`
            const locationData = await select(collection, 'location', providedLocation)
            console.log('locationData:', locationData)

            // comprobamos que hayan datos en la request, sino, lanzamos 204
            if (!locationData) {
                let errorMessage = 'No weather data for that location.'
                throw new CustomError(errorMessage, 204)
            }

            const dataValidated = await getWeatherForSpecificDateValidation({ latitude, longitude, date, hour })
            console.log('dataValidated:', dataValidated)
            const userDate = moment(`${date} ${dataValidated.hour}`)
            const { forecastData } = locationData
            const { list } = forecastData
            const forecastDates = list.filter(
                forecast => moment(forecast.dt_txt).isSame(userDate)
            )

            // comprobamos que existan en la api la fecha y hora proporcionadas
            if (!forecastDates.length) {
                let errorMessage = 'No data for provided date.'
                throw new CustomError(errorMessage, 204)
            }

            return forecastDates[0]
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            // Cerrar la conexión con MongoDB
            await client.close();
            console.log('Connection closed');
        }
    }
}