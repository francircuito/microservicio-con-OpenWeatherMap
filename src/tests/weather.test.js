import request from 'supertest';
import app from '../index.js'
import { MongoClient } from 'mongodb'
const api = request(app)
const mongodbUrl = process.env.MONGODB_URL

let client

beforeAll(async () => {
    client = await MongoClient.connect(mongodbUrl)
});

describe('Forecast for a location and date', () => {
    it('should return a 200 status and response body must equal with the test one', async () => {
        const forecastResponse = {
            "dt": 1710158400,
            "main": {
                "temp": 280.38,
                "feels_like": 279.28,
                "temp_min": 280.38,
                "temp_max": 280.38,
                "pressure": 1025,
                "sea_level": 1025,
                "grnd_level": 1012,
                "humidity": 69,
                "temp_kf": 0
            },
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "clouds": {
                "all": 100
            },
            "wind": {
                "speed": 1.83,
                "deg": 137,
                "gust": 2.08
            },
            "visibility": 10000,
            "pop": 0,
            "sys": {
                "pod": "n"
            },
            "dt_txt": "2024-03-11 12:00:00"
        }
        const latitude = '33.44'
        const longitude = '-94.04'
        const { statusCode, body } = await api
            .get('/forecast/location-and-date')
            .query({ latitude, longitude })
            
        expect(statusCode).toBe(200);
        expect(body).toEqual(forecastResponse);
    });
});

afterAll(async () => {
    await client.close();
});