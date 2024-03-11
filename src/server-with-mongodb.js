import createApp from './index.js'

import { WeatherModel } from './models/mongodb/weather.js'

createApp({ weatherModel: WeatherModel })