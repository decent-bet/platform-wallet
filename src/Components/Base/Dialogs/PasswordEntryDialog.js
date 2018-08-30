import React, { Component } from 'react'
import KeyHandler from '../KeyHandler'
import Themes from '../Themes'
import {
    Dialog,
    Slide,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { injectIntl, FormattedMessage } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

const styles = theme => ({
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
        const self = this
        return {
            isValidPassword: () => {
                let privateKey = keyHandler.get(self.state.password)
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
        const self = this
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    onClose={self.props.onClose}
                >
                    <DialogTitle>
                        <FormattedMessage
                            id="src.Components.Base.Dialogs.PasswordEntryDialog.EnterPassword"
                            description="Title"
                        />
                    </DialogTitle>
                    <DialogContent>
                        <div className="row">
                            <div className="col-12 mt-4">
                                <TextField
                                    label={ <FormattedMessage
                                            id="src.Components.Base.Dialogs.PasswordEntryDialog.EnterPassword"
                                            description="EnterPassword"
                                        />}
                                    fullWidth={true}
                                    value={self.state.password}
                                    type="password"
                                    onKeyPress={ev => {
                                        if (ev.key === 'Enter') {
                                            ev.preventDefault()
                                            if (
                                                self.helpers().isValidPassword()
                                            )
                                                self.props.onValidPassword(
                                                    self.state.password
                                                )
                                        }
                                    }}
                                    onChange={event => {
                                        self.setState({
                                            password: event.target.value
                                        })
                                    }}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions className={this.props.classes.buttonBar}>
                        <Button
                            disabled={!self.helpers().isValidPassword()}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                self.props.onValidPassword(self.state.password)
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
            </div>
        )
    }
}

PasswordEntryDialog.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(injectIntl(PasswordEntryDialog))
