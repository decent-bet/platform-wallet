import React, { Component } from 'react'
import KeyHandler from '../KeyHandler'
import {
    Dialog,
    Slide,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    DialogContentText,
    TextField
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { injectIntl, FormattedMessage } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

const styles = theme => ({
    root: {
        '&:first-child': {
            minWidth: '500px'
        }
    },
    buttonBar: {
        display: 'flex',
        justifyContent: 'space-even',
        alignItems: 'center'
    },
    button: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    }
})

function Transition(props) {
    return <Slide direction="up" {...props} />
}

const ethers = require('ethers')
const keyHandler = new KeyHandler()
const Wallet = ethers.Wallet

class PasswordEntryDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            password: ''
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.open !== prevProps.open) {
            this.setState({
                open: this.props.open,
                password: ''
            })
        }
    }

    helpers = () => {
        return {
            isValidPassword: () => {
                let privateKey = keyHandler.get(this.state.password).privateKey
                try {
                    const wallet = new Wallet(privateKey)
                    return (
                        wallet.address === window.web3Object.eth.defaultAccount
                    )
                } catch (e) {
                    return false
                }
            }
        }
    }

    render() {
        return (
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>
                        <FormattedMessage
                            id="src.Components.Base.Dialogs.PasswordEntryDialog.EnterPassword"
                            description="Title"
                        />
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText className={this.props.classes.root}>
                        
                    </DialogContentText>
                    <TextField
                                    label={ <FormattedMessage
                                            id="src.Components.Base.Dialogs.PasswordEntryDialog.EnterPassword"
                                            description="EnterPassword"
                                        />}
                                    fullWidth
                                    value={this.state.password}
                                    type="password"
                                    onKeyPress={ev => {
                                        if (ev.key === 'Enter') {
                                            ev.preventDefault()
                                            if (
                                                this.helpers().isValidPassword()
                                            )
                                                this.props.onValidPassword(
                                                    this.state.password
                                                )
                                        }
                                    }}
                                    onChange={event => {
                                        this.setState({
                                            password: event.target.value
                                        })
                                    }}
                                    autoFocus
                                />
                    </DialogContent>
                    <DialogActions className={this.props.classes.buttonBar}>
                        <Button
                            disabled={!this.helpers().isValidPassword()}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                this.props.onValidPassword(this.state.password)
                            }}
                            className={this.props.classes.button}
                        >
                            <FormattedMessage
                                id="common.Next"
                                description="Next"
                            />
                            <FontAwesomeIcon
                                icon="arrow-right"
                                className={this.props.classes.extendedIcon}
                            />
                        </Button>
                    </DialogActions>
                </Dialog>
        )
    }
}

PasswordEntryDialog.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(injectIntl(PasswordEntryDialog))
