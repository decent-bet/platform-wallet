// From: https://cloud.google.com/logging/docs/setup/nodejs#using_winston
const winston = require('winston')
const Logger = winston.Logger
const pkg = require('../package')
const LoggingWinston = require('@google-cloud/logging-winston').LoggingWinston

const loggingWinston = new LoggingWinston({
    labels: {
        name: pkg.name,
        version: pkg.version
    }
})

const logger = new Logger({
    level: 'error',
    transports: [new winston.transports.Console(), loggingWinston]
})

module.exports = logger
