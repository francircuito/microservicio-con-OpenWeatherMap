import Joi from 'joi'

export class WeatherSchema {
    static async getWeatherFromSomePlaceValidation({ latitude, longitude }) {
        try {
            const payload = {
                latitude,
                longitude
            }
            const latitudeRegex = /^-?([0-8]?[0-9]|90)\.\d{1,6}$/
            const longitudeRegex = /^-?((1?[0-7]?|[0-9]?)[0-9]|180)\.\d{1,6}$/
            const coordinatesSchemaValidation = Joi.object({
                latitude: Joi.string().pattern(latitudeRegex).required(),
                longitude: Joi.string().pattern(longitudeRegex).required()
            })
            await coordinatesSchemaValidation.validateAsync(payload)
        } catch (error) {
            throw error
        }
    }

    // esta función acepta tanto franja horaria inglés como español
    static async getWeatherForSpecificDateValidation({ latitude, longitude, date, hour }) {
        try {
            await WeatherSchema.getWeatherFromSomePlaceValidation({ latitude, longitude })

            const payload = {
                date,
                hour
            }

            const timeSlots = ['pm', 'am']
            const getProvidedTimeSlot = timeSlots.filter(
                timeSlot => hour.includes(timeSlot)
            )
            const timeSlot = getProvidedTimeSlot[0]

            const timesEquivalents = {
                1: 13,
                2: 14,
                3: 15,
                4: 16,
                5: 17,
                6: 18,
                7: 19,
                8: 20,
                9: 21,
                10: 22,
                11: 23
            }

            const removeTimeSlot = hour.replace(timeSlot, "")
            const getHour = removeTimeSlot.split(":")[0]
            const checkMinutes = hour.includes(":")
            const addSecond = checkMinutes
                ? ':00'
                : ':00:00'
            const minutes = checkMinutes ? removeTimeSlot.split(":").at(-1) : "00"

            if (getProvidedTimeSlot.includes("pm")) {
                payload.hour = `${timesEquivalents[getHour] ?? "12"}:${minutes}:00`
            }
            else if (getProvidedTimeSlot.includes("am") && Number(getHour) === 12) {
                payload.hour = payload.hour.replace('am', '').replace('12', '00').concat(addSecond)
            }
            else {
                payload.hour = payload.hour.replace('am', '').concat(addSecond)
            }

            const dateSchemaValidation = Joi.object({
                date: Joi.date().iso().required(),
                hour: Joi.string().pattern(
                    /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
                ).required()
            })
            return await dateSchemaValidation.validateAsync(payload)
        } catch (error) {
            throw error
        }
    }
}