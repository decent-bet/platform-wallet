import React, { Component } from 'react'
import { Typography } from '@material-ui/core'

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
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, info: null }
    }

    componentDidCatch(error, info) {
        logger.error(error)
        // Display fallback UI
        this.setState({ hasError: true, error, info })
    }

    render() {
        if (this.state.info) {
            return (
                <div style={{ zIndex: 9999, marginTop: 80 }}>
                    <Typography component="div">
                        <h2>An error ocurred</h2>
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.info.componentStack}
                        </details>
                    </Typography>
                </div>
            )
        }

        return this.props.children
    }
}
