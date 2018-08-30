import React, { Component } from 'react'
import { MuiThemeProvider } from 'material-ui'
import KeyHandler from '../KeyHandler'
import Themes from '../Themes'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField
} from '@material-ui/core'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../../i18n/componentMessages'

let i18n
const messages = componentMessages(
    'src.Components.Base.Dialogs.PasswordEntryDialog',
    ['EnterPassword']
)

const dialogStyles = require('../DialogStyles').styles
const ethers = require('ethers')
const keyHandler = new KeyHandler()
const themes = new Themes()
const Wallet = ethers.Wallet

class PasswordEntryDialog extends Component {
    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
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
                <MuiThemeProvider muiTheme={themes.getDialog()}>
                    <Dialog open={this.state.open} onClose={self.props.onClose}>
                        <DialogTitle>{i18n('EnterPassword')}</DialogTitle>
                        <DialogContent>
                            <div className="row">
                                <div className="col-12 mt-4">
                                    <TextField
                                        label={i18n('EnterPassword')}
                                        fullWidth={true}
                                        value={self.state.password}
                                        type="password"
                                        onKeyPress={ev => {
                                            if (ev.key === 'Enter') {
                                                ev.preventDefault()
                                                if (
                                                    self
                                                        .helpers()
                                                        .isValidPassword()
                                                )
                                                    self.props.onValidPassword(
                                                        self.state.password
                                                    )
                                            }
                                        }}
                                        onChange={(event) => {
                                            self.setState({
                                                password: event.target.value
                                            })
                                        }}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                disabled={!self.helpers().isValidPassword()}
                                onClick={() => {
                                    self.props.onValidPassword(
                                        self.state.password
                                    )
                                }}
                            >
                            Next
                            </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default injectIntl(PasswordEntryDialog)
