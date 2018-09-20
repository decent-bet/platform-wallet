<<<<<<< HEAD:src/logger.ts
// From: https://cloud.google.com/logging/docs/setup/nodejs#using_winston
const winston = require('winston')
const Logger = winston.Logger
=======
>>>>>>> development:src/logger.js
const pkg = require('../package')
const request = require('axios')
const url = 'https://us-central1-dbet-platform.cloudfunctions.net/electron-error-logger'

const logger = {
    error: (err) => {
        const data = {
            message: {
                stack: err.stack,
                message: err.message
            },
            appName: pkg.name,
            version: pkg.version,
        }

<<<<<<< HEAD:src/logger.ts
const logger = new Logger({
    level: 'error',
    transports: [new winston.transports.Console(), loggingWinston]
})
=======
        request.post(url, data).then()
    }
}
>>>>>>> development:src/logger.js

module.exports = logger
