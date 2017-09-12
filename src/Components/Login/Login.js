/**
 * Created by user on 9/7/2017.
 */

import React, {Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import Themes from './../Base/Themes'
const themes = new Themes()

import ConfirmationDialog from './../Base/ConfirmationDialog'

const bip39 = require('bip39')
const ethAddress = require('ethereum-address')
const ethers = require('ethers')
const constants = require('../Constants')

import KeyHandler from '../Base/KeyHandler'
const keyHandler = new KeyHandler()

const Wallet = ethers.Wallet

const styles = require('../Base/styles').styles

import './login.css'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: constants.LOGIN_PRIVATE_KEY,
            key: '',
            mnemonic: '',
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                }
            }
        }
        if(keyHandler.isLoggedIn())
            window.location = constants.PAGE_WALLET
    }

    actions = () => {
        const self = this
        return {
            login: () => {
                if (self.state.login == constants.LOGIN_PRIVATE_KEY)
                    self.actions().loginPrivateKey()
                else if (self.state.login == constants.LOGIN_MNEMONIC)
                    self.actions().loginMnemonic()
            },
            loginPrivateKey: () => {
                console.log('Logging in with private key', self.state.key)
                try {
                    const wallet = new Wallet(self.state.key)
                    keyHandler.set(wallet.privateKey)
                    window.location = constants.PAGE_WALLET
                } catch (e) {
                    self.helpers().toggleErrorDialog(true, 'Error',
                        'Invalid private key. Please make sure you\'re entering a valid private key')
                }
            },
            loginMnemonic: () => {
                console.log('Logging in with mnemonic', self.state.mnemonic)
                try {
                    const wallet = Wallet.fromMnemonic(self.state.mnemonic)
                    keyHandler.set(wallet.privateKey)
                    window.location = constants.PAGE_WALLET
                } catch (e) {
                    self.helpers().toggleErrorDialog(true, 'Error',
                        'Invalid mnemonic. Please make sure you\'re entering a valid mnemonic')
                }
            }
        }
    }

    views = () => {
        const self = this
        return {
            top: () => {
                return <div className="row">
                    <div className="col">
                        <img src={process.env.PUBLIC_URL + '/assets/img/logos/dbet-white.png'} className="logo"/>
                        <h4 className="sub-header">WALLET</h4>
                    </div>
                </div>
            },
            privateKey: () => {
                return <div className="row private-key">
                    <div className="col-10">
                        <TextField
                            type="text"
                            hintText={
                                self.state.login == constants.LOGIN_PRIVATE_KEY ?
                                    "Enter your private key.. (Prefix with 0x)" : "Enter your 12 word mnemonic.."
                            }
                            fullWidth={true}
                            hintStyle={styles.textField.hintStyle}
                            inputStyle={styles.textField.inputStyle}
                            floatingLabelStyle={styles.textField.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                            underlineStyle={styles.textField.underlineStyle}
                            underlineFocusStyle={styles.textField.underlineStyle}
                            value={self.state.login == constants.LOGIN_PRIVATE_KEY ? self.state.key : self.state.mnemonic}
                            onChange={(event, value) => {
                                let state = self.state
                                if (state.login == constants.LOGIN_PRIVATE_KEY)
                                    state.key = value
                                else if (state.login == constants.LOGIN_MNEMONIC)
                                    state.mnemonic = value
                                self.setState(state)
                            }}
                        />
                    </div>
                    <div className="col-2">
                        <DropDownMenu
                            value={self.state.login}
                            onChange={(event, index, value) => {
                                self.setState({
                                    login: value
                                })
                            }}
                            underlineStyle={styles.dropdown.underlineStyle}
                            labelStyle={styles.dropdown.labelStyle}
                            selectedMenuItemStyle={styles.dropdown.selectedMenuItemStyle}
                            menuItemStyle={styles.dropdown.menuItemStyle}
                            listStyle={styles.dropdown.listStyle}>
                            <MenuItem value={constants.LOGIN_PRIVATE_KEY} primaryText="Private key"/>
                            <MenuItem value={constants.LOGIN_MNEMONIC} primaryText="Mnemonic"/>
                        </DropDownMenu>
                    </div>
                    <div className="col-6">
                        <RaisedButton
                            label="Login"
                            backgroundColor={constants.COLOR_PRIMARY}
                            disabledBackgroundColor={constants.COLOR_WHITE_DARK}
                            /** To get rid of unnecessary white edges caused by white background under rounded borders */
                            style={{
                                backgroundColor: constants.COLOR_PRIMARY
                            }}
                            labelStyle={styles.button.label}
                            className="float-right btns"
                            disabled={
                                !(self.state.login == constants.LOGIN_PRIVATE_KEY && self.state.key.length > 0 ||
                                self.state.login == constants.LOGIN_MNEMONIC && self.state.mnemonic.length > 0 )
                            }
                            onClick={self.actions().login}
                        />
                    </div>
                    <div className="col-6">
                        <RaisedButton
                            label="New wallet"
                            backgroundColor={constants.COLOR_ACCENT_DARK}
                            /** To get rid of unnecessary white edges caused by white background under rounded borders */
                            style={{
                                backgroundColor: constants.COLOR_ACCENT_DARK
                            }}
                            onClick={() => {
                                window.location = constants.PAGE_WALLET_NEW
                            }}
                            labelStyle={styles.button.label}
                            className="btns"
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
            }
        }
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="login">
                    <div className="container h-100">
                        <div className="row h-100">
                            <div className="col my-auto">
                                { self.views().top() }
                                { self.views().privateKey() }
                            </div>
                        </div>
                    </div>
                    { self.dialogs().error() }
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Login