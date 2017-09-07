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

const ethAddress = require('ethereum-address')
const ethers = require('ethers')
const constants = require('../Constants')

const Wallet = ethers.Wallet

const styles = require('../Base/styles').styles

import './login.css'

const LOGIN_PRIVATE_KEY = 0, LOGIN_MNEMONIC = 1

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: LOGIN_PRIVATE_KEY,
            key: '',
            mnemonic: ''
        }
    }

    actions = () => {
        const self = this
        return {
            login: () => {
                console.log('Login', self.state.login)
                if (self.state.login == LOGIN_PRIVATE_KEY)
                    self.actions().loginPrivateKey()
                else if (self.state.login == LOGIN_MNEMONIC)
                    self.actions().loginMnemonic()
            },
            loginPrivateKey: () => {
                console.log('Logging in with private key', self.state.key)
                try {
                    const wallet = new Wallet(self.state.key)

                    console.log('Address', wallet.address)
                } catch (e) {
                    console.log('Error logging in', e.message)
                }
            },
            loginMnemonic: () => {
                console.log('Logging in with mnemonic', self.state.mnemonic)
                try {
                    const wallet = Wallet.fromMnemonic(self.state.mnemonic)

                    console.log('Address', wallet.address)
                } catch (e) {
                    console.log('Error logging in', e.message)
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
                                self.state.login == LOGIN_PRIVATE_KEY ?
                                    "Enter your private key.. (Prefix with 0x)" : "Enter your 12 word mnemonic.."
                            }
                            fullWidth={true}
                            hintStyle={styles.textField.hintStyle}
                            inputStyle={styles.textField.inputStyle}
                            floatingLabelStyle={styles.textField.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                            underlineStyle={styles.textField.underlineStyle}
                            underlineFocusStyle={styles.textField.underlineStyle}
                            onChange={(event, value) => {
                                let state = self.state
                                if (state.login == LOGIN_PRIVATE_KEY)
                                    state.key = value
                                else if (state.login == LOGIN_MNEMONIC)
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
                            <MenuItem value={LOGIN_PRIVATE_KEY} primaryText="Private key"/>
                            <MenuItem value={LOGIN_MNEMONIC} primaryText="Mnemonic"/>
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
                                !(self.state.login == LOGIN_PRIVATE_KEY && self.state.key.length > 0 ||
                                self.state.login == LOGIN_MNEMONIC && self.state.mnemonic.length > 0 )
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
                            labelStyle={styles.button.label}
                            className="btns"
                        />
                    </div>
                </div>
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
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Login