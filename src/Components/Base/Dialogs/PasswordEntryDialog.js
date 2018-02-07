import React, {Component} from 'react'

import {Dialog, FlatButton, MuiThemeProvider, TextField} from 'material-ui'

import KeyHandler from '../KeyHandler'
import Themes from '../Themes'

const dialogStyles = require('../DialogStyles').styles
const ethers = require('ethers')
const keyHandler = new KeyHandler()
const themes = new Themes()
const Wallet = ethers.Wallet

class PasswordEntryDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            password: ''
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            open: nextProps.open,
            password: ''
        })
    }

    helpers = () => {
        const self = this
        return {
            isValidPassword: () => {
                let privateKey = keyHandler.get(self.state.password)
                try {
                    const wallet = new Wallet(privateKey)
                    return (wallet.address === window.web3Object.eth.defaultAccount)
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
                    <Dialog
                        title="Enter Password"
                        actions={<FlatButton
                            label="Next"
                            primary={false}
                            disabled={!self.helpers().isValidPassword()}
                            onClick={() => {
                                self.props.onValidPassword(self.state.password)
                            }}/>
                        }
                        modal={false}
                        open={this.state.open}
                        onRequestClose={self.props.onClose}>
                        <div className="row">
                            <div className="col-12 mt-4">
                                <TextField
                                    hintText="Enter password"
                                    fullWidth={true}
                                    hintStyle={{color: '#949494'}}
                                    floatingLabelStyle={dialogStyles.floatingLabelStyle}
                                    floatingLabelFocusStyle={dialogStyles.floatingLabelFocusStyle}
                                    inputStyle={dialogStyles.inputStyle}
                                    underlineStyle={dialogStyles.underlineStyle}
                                    underlineFocusStyle={dialogStyles.underlineStyle}
                                    underlineDisabledStyle={dialogStyles.underlineDisabledStyle}
                                    value={self.state.password}
                                    type="password"
                                    onKeyPress={(ev) => {
                                        if (ev.key === 'Enter') {
                                            ev.preventDefault()
                                            if (self.helpers().isValidPassword())
                                                self.props.onValidPassword(self.state.password)
                                        }
                                    }}
                                    onChange={(event, value) => {
                                        self.setState({
                                            password: value
                                        })
                                    }}
                                    autoFocus/>
                            </div>
                        </div>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }

}

export default PasswordEntryDialog