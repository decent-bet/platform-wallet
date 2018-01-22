import React, {Component} from 'react'

import {CircularProgress, Dialog, FlatButton, MuiThemeProvider, TextField} from 'material-ui'

import Helper from '../../Helper'
import Themes from '../../Base/Themes'

const helper = new Helper()
const styles = require('../../Base/styles').styles
const themes = new Themes()

const constants = require('../../Constants')

class TransferConfirmationDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            address: '',
            amount: props.amount,
            ethBalance: props.ethBalance,
            gasPrice: constants.DEFAULT_GAS_PRICE,
            errors: {
                address: false,
                gasPrice: false
            }
        }
    }

    componentWillReceiveProps = (props) => {
        let newState = {
            open: props.open,
            amount: props.amount,
            ethBalance: props.ethBalance
        }
        if (props.open) {
            newState.address = ''
            newState.gasPrice = constants.DEFAULT_GAS_PRICE
        }
        this.setState(newState)
    }

    views = () => {
        return {
            tinyLoader: () => {
                return <CircularProgress
                    size={18}
                />
            }
        }
    }

    helpers() {
        const self = this
        return {
            getGasCost: () => {
                let gasPrice = parseInt(self.state.gasPrice)
                let gasLimit = 60000
                if (self.helpers().isValidPositiveNumber(gasPrice)) {
                    let gwei = helper.getWeb3().toWei('1', 'gwei')
                    return (helper.getWeb3()
                            .fromWei(
                                helper.getWeb3().toBigNumber(gasLimit).times(gasPrice).times(gwei),
                                'ether').toFixed()) + ' ETH'
                } else
                    return 'Please enter a valid gas price'
            },
            getEthBalance: () => {
                return (self.state.ethBalance == null) ? self.views().tinyLoader() : self.state.ethBalance
            },
            isValidPositiveNumber: (n) => {
                return (n).toString().length > 0 && n > 0
            }
        }
    }

    render() {
        const self = this
        return (
            <div>
                <MuiThemeProvider muiTheme={themes.getDialog()}>
                    <Dialog
                        title='Confirmation - Send DBETs'
                        actions={<FlatButton
                            label="Send"
                            primary={false}
                            onTouchTap={ () => {
                                let errors = self.state.errors

                                errors.address = !helper.getWeb3().isAddress(self.state.address)
                                errors.gasPrice =
                                    parseInt(self.state.gasPrice) == 0 ||
                                    self.state.gasPrice.length == 0

                                if (!errors.address && !errors.gasPrice)
                                    self.props.onConfirmTransaction(
                                        self.state.address,
                                        self.state.amount,
                                        self.state.gasPrice
                                    )

                                self.setState({
                                    errors: errors
                                })
                            }}/>
                        }
                        autoScrollBodyContent={true}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={self.props.onClose}>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <TextField
                                        type="text"
                                        fullWidth={true}
                                        inputStyle={styles.textField.inputStyle}
                                        floatingLabelText="Receiver Address"
                                        floatingLabelStyle={styles.textField.floatingLabelStyle}
                                        floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                                        underlineStyle={styles.textField.underlineStyle}
                                        underlineFocusStyle={styles.textField.underlineStyle}
                                        value={self.state.address}
                                        onChange={(event, value) => {
                                            self.setState({
                                                address: value
                                            })
                                        }}
                                    />
                                    {   self.state.errors.address &&
                                    <p className="text-danger">Invalid address</p>
                                    }
                                </div>
                                <div className="col-12 col-md-6">
                                    <TextField
                                        type="number"
                                        fullWidth={true}
                                        inputStyle={styles.textField.inputStyle}
                                        floatingLabelText="Amount of DBETs"
                                        floatingLabelStyle={styles.textField.floatingLabelStyle}
                                        floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                                        underlineStyle={styles.textField.underlineStyle}
                                        underlineFocusStyle={styles.textField.underlineStyle}
                                        value={self.state.amount}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <TextField
                                        type="number"
                                        fullWidth={true}
                                        inputStyle={styles.textField.inputStyle}
                                        floatingLabelText="Gas Price (GWei)"
                                        floatingLabelStyle={styles.textField.floatingLabelStyle}
                                        floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                                        underlineStyle={styles.textField.underlineStyle}
                                        underlineFocusStyle={styles.textField.underlineStyle}
                                        value={self.state.gasPrice}
                                        onChange={(event, value) => {
                                            self.setState({
                                                gasPrice: value
                                            })
                                        }}
                                    />
                                    {   self.state.errors.gasPrice &&
                                    <p className="text-danger">Invalid gas price</p>
                                    }
                                </div>
                            </div>
                            <p>Please make sure you have enough ETH to cover gas costs for the token transfer.
                                Enter a gas price in gwei to send the transaction. {self.state.gasPrice} gwei
                                is recommended for quick and economic transactions. For up-to-date information on
                                current gas prices, please visit
                                <a className="dbet-link"
                                   onClick={() => {
                                       helper.openUrl('http://ethgasstation.info/')
                                   }}> ETH Gas station
                                </a></p>
                            <small>Gas cost: {self.helpers().getGasCost()}</small><br/>
                            <small>ETH balance: {self.helpers().getEthBalance()} ETH</small>
                        </div>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }

}

export default TransferConfirmationDialog