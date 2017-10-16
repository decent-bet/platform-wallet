/**
 * Created by user on 9/7/2017.
 */

import React, {Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'

import Themes from './../Base/Themes'

const themes = new Themes()

import ConfirmationDialog from './../Base/ConfirmationDialog'

const bip39 = require('bip39')
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
            login: constants.LOGIN_MNEMONIC,
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
        if (keyHandler.isLoggedIn())
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
            loginMethod: () => {
                return <div className="col-8 mx-auto login-method">
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
                        <MenuItem value={constants.LOGIN_MNEMONIC} primaryText="Passphrase" style={styles.menuItem}/>
                        <MenuItem value={constants.LOGIN_PRIVATE_KEY} primaryText="Private key"
                                  style={styles.menuItem}/>
                    </DropDownMenu>
                </div>
            },
            enterCredentials: () => {
                return <div className="col-8 mx-auto enter-credentials">
                    <div className="row h-100">
                        <div className="col my-auto">
                            <TextField
                                type="text"
                                className="input-field"
                                fullWidth={true}
                                hintText={self.helpers().getHint()}
                                hintStyle={styles.textField.hintStyle}
                                inputStyle={styles.textField.inputStyle}
                                floatingLabelStyle={styles.textField.floatingLabelStyle}
                                floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                                underlineStyle={styles.textField.underlineStyle}
                                underlineFocusStyle={styles.textField.underlineStyle}
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
                    </div>
                </div>
            },
            loginButton: () => {
                return <div className={"col-8 mx-auto login-button " +
                (!self.helpers().isValidCredentials() ? 'disabled' : '')}
                            onClick={() => {
                                if (self.helpers().isValidCredentials())
                                    self.actions().login()
                            }}>
                    <p className="text-center"><i className="fa fa-key mr-2"/> Login</p>
                </div>
            },
            createAccount: () => {
                return <div className="col-8 mx-auto create-account">
                    <p className="text-center">Don't have an account?
                        <a href={constants.PAGE_WALLET_NEW}> Create one now</a>
                    </p>
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
            },
            getHint: () => {
                switch (self.state.login) {
                    case constants.LOGIN_MNEMONIC:
                        return "Enter your passphrase"
                    case constants.LOGIN_PRIVATE_KEY:
                        return "Enter your private key"
                }
            },
            isValidCredentials: () => {
                return (self.state.login == constants.LOGIN_PRIVATE_KEY && self.state.key.length > 0 ||
                self.state.login == constants.LOGIN_MNEMONIC && self.state.mnemonic.length > 0 )
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
                            <div className="col">
                                <div className="row">
                                    {self.views().loginMethod()}
                                    {self.views().enterCredentials()}
                                    {self.views().loginButton()}
                                    {self.views().createAccount()}
                                </div>
                            </div>
                        </div>
                    </div>
                    {self.dialogs().error()}
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Login