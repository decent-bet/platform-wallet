import React, { Component } from 'react'
import { Typography } from '@material-ui/core'

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, info: null }
    }

    componentDidCatch(error, info) {
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
