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

        request.post(url, data).then()
    }
}

module.exports = logger
