import React, { Component } from 'react'

// V0
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'

import Themes from '../Themes'

const themes = new Themes()

class ConfirmationDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: props.message,
            open: props.open
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.open !== state.open || props.title !== state.title) {
            return {
                title: props.title,
                message: props.message,
                open: props.open
            }
        }
        return null
    }

    render() {
        const self = this
        return (
            <div>
                <MuiThemeProvider muiTheme={themes.getDialog()}>
                    <Dialog
                        title={self.props.title}
                        actions={
                            <Button
                                label="Ok"
                                primary={false}
                                onTouchTap={self.props.onClick}
                            />
                        }
                        modal={false}
                        open={this.state.open}
                        autoScrollBodyContent={true}
                        onRequestClose={self.props.onClose}
                    >
                        <p>{self.state.message}</p>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default ConfirmationDialog
