import { MongoClient } from 'mongodb'
import CustomError from '../utils/errorClass.js'

// const mongodbUrl = process.env.MONGODB_URL
// const mongodbName = process.env.MONGODB_DBNAME

// export const createConnection = async () => {
//     try {
//         const client = await MongoClient.connect(mongodbUrl)
//         await client.connect()
//         console.log('Database connected successfully to server.')
//         const db = client.db(mongodbName)
//         return db.collection('weatherData')
//     } catch (error) {
//         console.error('Failed to connect to MongoDB:', error)
//         await client.close()
//         throw error
//     }
// }

export class MongoDBClient {
    static async select(db, fieldName, condition) {
        try {
            const data = await db.findOne(
                {
                    [fieldName]: condition
                }
            )
            return data
        } catch (error) {
            console.error('Failed to get data in current MongoDB collection:', error)
            throw error
        }
    }

    static async insert(db, { location, forecastData, date }) {
        try {
            await db.insertOne(
                {
                    location,
                    forecastData,
                    date
                }
            )
        } catch (error) {
            console.error('Failed to insert to MongoDB collection:', error)
            throw error
        }
    }

    static async update(db, fieldName, condition, data, date) {
        try {
            await db.updateOne({ [fieldName]: condition },
                {
                    $set: {
                        ...data,
                        date: date
                    }
                }
            )
        } catch (error) {
            console.error('Failed to update to MongoDB collection:', error)
            throw error
        }
    }
}