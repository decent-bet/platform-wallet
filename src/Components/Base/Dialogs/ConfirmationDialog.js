import React, { Component } from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

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
        if (props.title !== state.title) {
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
                            <FlatButton
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
