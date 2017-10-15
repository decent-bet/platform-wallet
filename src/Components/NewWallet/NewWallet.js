/**
 * Created by user on 9/11/2017.
 */

import React, {Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import Themes from './../Base/Themes'
const themes = new Themes()

import ConfirmationDialog from './../Base/ConfirmationDialog'
import ProceedDialog from './Dialogs/ProceedDialog'

const bip39 = require('bip39')
const ethers = require('ethers')
const constants = require('../Constants')

const Wallet = ethers.Wallet

const styles = require('../Base/styles').styles

import './newwallet.css'

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
                proceed: {
                    open: false
                }
            }
        }
    }

    actions = () => {
        const self = this
        return {
            generateMnemonic: () => {
                let mnemonic = bip39.generateMnemonic()
                console.log('New mnemonic', mnemonic)
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
                return <div className="row">
                    <div className="col">
                        <h4 className="sub-header">WALLET</h4>
                    </div>
                </div>
            },
            mnemonic: () => {
                return <div className="row mnemonic">
                    <div className="col-9">
                        <TextField
                            type="text"
                            fullWidth={true}
                            hintStyle={styles.textField.hintStyle}
                            inputStyle={styles.textField.inputStyle}
                            floatingLabelStyle={styles.textField.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                            underlineStyle={styles.textField.underlineStyle}
                            underlineFocusStyle={styles.textField.underlineStyle}
                            value={self.state.mnemonic}
                        />
                    </div>
                </div>
            },
            instructions: () => {
                return <div className="row instructions">
                    <div className="col">
                        <p className="text-center">MAKE SURE THE SEED THAT YOU CHOOSE IS STORED IN A SAFE PLACE. ONCE
                            YOU'RE ABSOLUTELY SURE,
                            CLICK
                            ON THE BUTTON BELOW TO CONTINUE</p>
                    </div>
                </div>
            },
            proceed: () => {
                return <div className="row proceed">
                    <div className="col">
                        <RaisedButton
                            label="Generate seed phrase"
                            fullWidth={true}
                            backgroundColor={constants.COLOR_ACCENT_DARK}
                            /** To get rid of unnecessary white edges caused by white background under rounded borders */
                            style={{
                                backgroundColor: constants.COLOR_ACCENT_DARK
                            }}
                            onClick={self.actions().generateMnemonic}
                            labelStyle={styles.button.label}
                        />
                        <RaisedButton
                            label="Proceed"
                            disabled={self.state.mnemonic.length == 0}
                            disabledBackgroundColor={constants.COLOR_WHITE_DARK}
                            className="proceed-btn"
                            backgroundColor={constants.COLOR_ACCENT_DARK}
                            /** To get rid of unnecessary white edges caused by white background under rounded borders */
                            style={{
                                backgroundColor: constants.COLOR_ACCENT_DARK
                            }}
                            onClick={() => {
                                self.helpers().toggleProceedDialog(true)
                            }}
                            labelStyle={styles.button.label}
                        />
                    </div>
                </div>
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
            proceed: () => {
                return <ProceedDialog
                    onProceed={() => {
                        console.log('Valid mnemonic')
                        window.location = '/wallet/login'
                    }}
                    toggleDialog={(open) => {
                        self.helpers().toggleProceedDialog(open)
                    }}
                    mnemonic={self.state.mnemonic}
                    open={self.state.dialogs.proceed.open}
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
            toggleProceedDialog: (open) => {
                let dialogs = self.state.dialogs
                dialogs.proceed.open = open
                self.setState({
                    dialogs: dialogs
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
                            <div className="col my-auto">
                                { self.views().top() }
                                { self.views().mnemonic() }
                                { self.views().instructions() }
                                { self.views().proceed() }
                            </div>
                        </div>
                    </div>
                    { self.dialogs().error() }
                    { self.dialogs().proceed() }
                </div>
            </MuiThemeProvider>
        )
    }

}

export default NewWallet