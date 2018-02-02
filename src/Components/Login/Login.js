import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {DropDownMenu, MenuItem, MuiThemeProvider } from 'material-ui'

import LoginInner from './LoginInner.jsx'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import KeyHandler from '../Base/KeyHandler'
import Themes from './../Base/Themes'

import './login.css'

const constants = require('../Constants')
const ethers = require('ethers')
const Wallet = ethers.Wallet

const keyHandler = new KeyHandler()
const styles = require('../Base/styles').styles
const themes = new Themes()

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: constants.LOGIN_MNEMONIC,
            key: '',
            mnemonic: '',
            password: '',
            confirmPassword: '',
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                }
            }
        }
        if (keyHandler.isLoggedIn())
            browserHistory.push(constants.PAGE_WALLET)
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
                try {
                    const wallet = new Wallet(self.state.key)
                    keyHandler.set(wallet.privateKey, wallet.address, self.state.password)
                    browserHistory.push(constants.PAGE_WALLET)
                } catch (e) {
                    self.helpers().toggleErrorDialog(true, 'Error',
                        'Invalid private key. Please make sure you\'re entering a valid private key')
                }
            },
            loginMnemonic: () => {
                try {
                    const wallet = Wallet.fromMnemonic(self.state.mnemonic)
                    keyHandler.set(wallet.privateKey, wallet.address, self.state.password)
                    browserHistory.push(constants.PAGE_WALLET)
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
                return <div className="col-10 col-md-8 mx-auto login-method">
                    <DropDownMenu
                        value={self.state.login}
                        onChange={(event, index, value) => {
                            let key = self.state.key
                            let mnemonic = self.state.mnemonic
                            if (value == constants.LOGIN_MNEMONIC)
                                mnemonic = ''
                            else
                                key = ''
                            self.setState({
                                key: key,
                                mnemonic: mnemonic,
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
            loginButton: () => {
                return <div className={"col-10 col-md-8 mx-auto login-button " +
                (!self.helpers().isValidCredentials() ? 'disabled' : '')}
                            onClick={() => {
                                if (self.helpers().isValidCredentials())
                                    self.actions().login()
                            }}>
                    <p className="text-center"><i className="fa fa-key mr-2"/> Login</p>
                </div>
            },
            createAccount: () => {
                return <div className="col-10 col-md-8 mx-auto create-account">
                    <p className="text-center">
                        <span onClick={() => {
                            browserHistory.push(constants.PAGE_WALLET_NEW)
                        }}> Create New Wallet</span>
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
            isValidCredentials: () => {
                return ((self.state.login == constants.LOGIN_PRIVATE_KEY && self.state.key.length > 0 ||
                self.state.login == constants.LOGIN_MNEMONIC && self.state.mnemonic.length > 0) &&
                self.state.password.length >= 8 && self.state.password == self.state.confirmPassword)
            }
        }
    }

    onKeyPressedListener = (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault()
            if (self.helpers().isValidCredentials()){
                self.actions().login()
            }
        }
    }

    onMnemonicChangedListener = (event, value) => {
        let state = this.state
        if (state.login === constants.LOGIN_PRIVATE_KEY){ 
            state.key = value
        } else if (state.login === constants.LOGIN_MNEMONIC){
            state.mnemonic = value
        }
        this.setState(state)
    }

    onPasswordChangedListener = (event, value) => {
        this.setState({ password: value })
    }

    onPasswordConfirmationChangedListener = (event, value) => {
        this.setState({ confirmPassword: value })
    }

    renderInnerLoginDialog = () => {
        return (
            <LoginInner
                mnemonic={this.state.mnemonic}
                key={this.state.key}
                loginType={this.state.login}
                password={this.state.password}
                confirmPassword={this.state.confirmPassword}
                onMnemonicChangedListener={this.onMnemonicChangedListener }
                onPasswordChangedListener={this.onPasswordChangedListener}
                onPasswordConfirmationChangedListener={
                    this.onPasswordConfirmationChangedListener
                }
                onKeyPressListener={this.onKeyPressedListener}
                />
        )
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
                                    <div className="col-10 col-md-8 mx-auto enter-credentials">
                                        {this.renderInnerLoginDialog()}
                                    </div>
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