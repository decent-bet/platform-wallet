import React, { Component } from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    Button
} from '@material-ui/core'
import Themes from '../Themes'

const themes = new Themes()

function Transition(props) {
    return <Slide direction="up" {...props} />
}

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
        return (
            <div>
                <MuiThemeProvider theme={themes.getDialog()}>
                    <Dialog
                        open={this.state.open}
                        TransitionComponent={Transition}
                        onClose={this.props.onClose}
                    >
                        <DialogTitle>
                            <span>{this.props.title}</span>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {this.state.message}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={this.props.onClick}
                                variant="outlined"
                            >
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default ConfirmationDialog
