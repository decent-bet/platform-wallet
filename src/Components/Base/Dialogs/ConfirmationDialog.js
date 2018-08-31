import React, { Component } from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    Button
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    dialogText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.unit
    }
})

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
        const { fullScreen } = this.props;
        return (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.open}
                TransitionComponent={Transition}
                onClose={this.props.onClose}
            >
                <DialogTitle>
                    <span>{this.props.title}</span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className={this.props.classes.dialogText}>
                        <div>{this.state.message}</div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClick} 
                            variant="contained"
                            color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(ConfirmationDialog)

