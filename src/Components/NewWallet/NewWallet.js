import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import { MuiThemeProvider, Snackbar, TextField, FlatButton} from 'material-ui'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import NextDialog from './Dialogs/NextDialog'

import KeyHandler from '../Base/KeyHandler'
import Themes from './../Base/Themes'

import './newwallet.css'

const bip39 = require('bip39')
const constants = require('../Constants')
const ethers = require('ethers')
const keyHandler = new KeyHandler()
const styles = require('../Base/styles').styles
const themes = new Themes()
const Wallet = ethers.Wallet

class NewWallet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mnemonic: '',
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                },
                next: {
                    open: false
                }
            },
            snackbar: {
                open: false
            }
        }
    }

    componentWillMount = () => {
        this.actions().generateMnemonic()
    }

    actions = () => {
        const self = this
        return {
            generateMnemonic: () => {
                let mnemonic = bip39.generateMnemonic()
                self.setState({
                    mnemonic: mnemonic
                })
            }
        }
    }

    views = () => {
        const self = this
        return {
            top: () => {
                return <div className="col-10 col-md-8 mx-auto top">
                    <p className="pt-3">Create New Wallet</p>
                </div>
            },
            mnemonic: () => (
                <div className="col-10 col-md-8 mx-auto mnemonic">
                    <p>This is your Passphrase:</p>
                    <TextField
                        id="input-mnemonic"
                        type="text"
                        fullWidth={true}
                        multiLine={true}
                        hintStyle={styles.textField.hintStyle}
                        inputStyle={styles.textField.inputStyle}
                        floatingLabelStyle={styles.textField.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                        underlineStyle={styles.textField.underlineStyle}
                        underlineFocusStyle={styles.textField.underlineStyle}
                        value={self.state.mnemonic}
                    />

                    <FlatButton
                        onClick={self.actions().generateMnemonic}
                        backgroundColor='#333'
                        label="Generate New Passphrase"
                        fullWidth={true}
                        icon={<i className="fa fa-undo"></i>}
                        />

                    <p>
                        Write down your passphrase and store it in a safe place before clicking "Next"
                    </p>
                </div>
            ),
            buttonBar: () => (
                <div className="col-10 col-md-8 mx-auto custom-button-container">
                    <div className="custom-button"
                        onClick={() => {
                            browserHistory.push(constants.PAGE_WALLET_LOGIN)
                        }}
                        >
                        <p>Back</p>
                    </div>
                    <div className="custom-button"
                        disabled={self.state.mnemonic.length === 0}
                        onClick={() => {
                            self.helpers().toggleNextDialog(true)
                        }}
                        >
                        <p>Next</p>
                    </div>
                </div>
            ),
            snackbar: () => {
                return <MuiThemeProvider muiTheme={themes.getSnackbar()}>
                    <Snackbar
                        message="Copied passphrase to clipboard"
                        open={self.state.snackbar.open}
                        autoHideDuration={3000}
                    />
                </MuiThemeProvider>
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            error: () => {
                return <ConfirmationDialog
                    onClick={() => {
                        self.helpers().toggleErrorDialog(false)
                    }}
                    onClose={() => {
                        self.helpers().toggleErrorDialog(false)
                    }}
                    title={self.state.dialogs.error.title}
                    message={self.state.dialogs.error.message}
                    open={self.state.dialogs.error.open}
                />
            },
            next: () => {
                return <NextDialog
                    onNext={(password) => {
                        const wallet = Wallet.fromMnemonic(self.state.mnemonic)
                        keyHandler.set(wallet.privateKey, wallet.address, password)
                        browserHistory.push(constants.PAGE_WALLET)
                    }}
                    toggleDialog={(open) => {
                        self.helpers().toggleNextDialog(open)
                    }}
                    mnemonic={self.state.mnemonic}
                    open={self.state.dialogs.next.open}
                />
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            toggleErrorDialog: (open, title, message) => {
                let dialogs = self.state.dialogs
                dialogs.error = {
                    open: open,
                    title: title,
                    message: message
                }
                self.setState({
                    dialogs: dialogs
                })
            },
            toggleNextDialog: (open) => {
                let dialogs = self.state.dialogs
                dialogs.next.open = open
                self.helpers().toggleSnackbar(false)
                self.setState({
                    dialogs: dialogs
                })
            },
            toggleSnackbar: (open) => {
                let snackbar = self.state.snackbar
                snackbar.open = open
                self.setState({
                    snackbar: snackbar
                })
            }
        }
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="new-wallet">
                    <div className="container h-100">
                        <div className="row h-100">
                            { self.views().top() }
                            { self.views().mnemonic() }
                            { self.views().buttonBar() }
                        </div>
                    </div>
                    { self.dialogs().error() }
                    { self.dialogs().next() }
                    { self.views().snackbar() }
                </div>
            </MuiThemeProvider>
        )
    }

}

export default NewWallet